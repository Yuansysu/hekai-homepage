import '@fontsource/cinzel/500.css';
import '@fontsource/noto-serif-sc/400.css';
import '@fontsource/noto-serif-sc/600.css';
import './style.css';

import * as THREE from 'three';
import { LINKS } from './content.js';
import { createPanel } from './panel.js';
import { PADS, BLOSSOM_GLOW, mulberry32, buildTree, buildBlossoms } from './scene/tree.js';
import { buildEnvironment, makeSoilHeight } from './scene/environment.js';
import { buildPetals } from './scene/petals.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchOnly = matchMedia('(hover: none)').matches;

const stage = document.getElementById('stage');
const canvas = document.getElementById('scene');
const nav = document.getElementById('links');
const masthead = document.querySelector('.masthead');
if (touchOnly) document.getElementById('hint').textContent = '轻触枝头 · 进入链接';

/* ---------- 链接标签 ---------- */

const EXT_ICON =
  '<svg class="link__ext" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 7 7 3M4 3h3v3" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>';

let active = -1;
let onActiveChange = () => {};

function setActive(i) {
  if (i === active) return;
  active = i;
  labels.forEach((el, k) => el.classList.toggle('is-active', k === i));
  stage.classList.toggle('has-active', i >= 0);
  onActiveChange(i);
}

const labels = LINKS.map((l, i) => {
  const a = document.createElement('a');
  a.className = 'link';
  a.href = l.href;
  if (l.external) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
  a.dataset.side = PADS[i + 1].side > 0 ? 'right' : 'left';
  a.innerHTML = `<span class="link__name">${l.name}</span><span class="link__handle">${l.handle}${l.external ? EXT_ICON : ''}</span>`;
  a.addEventListener('pointerenter', () => setActive(i));
  a.addEventListener('pointerleave', () => setActive(-1));
  a.addEventListener('focus', () => setActive(i));
  a.addEventListener('blur', () => setActive(-1));
  nav.append(a);
  return a;
});

let panelOpen = false;
createPanel({
  onChange: (open) => {
    panelOpen = open;
    if (open) setActive(-1);
  },
});

function follow(i) {
  const l = LINKS[i];
  if (l.external) window.open(l.href, '_blank', 'noopener');
  else location.hash = l.href;
}

/* ---------- three.js 场景 ---------- */

let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (err) {
  console.warn('WebGL 不可用，改用纯文字版', err);
}

if (!renderer) {
  document.body.classList.add('no-webgl');
  labels.forEach((el) => el.classList.add('is-in'));
} else {
  initScene(renderer);
}

function initScene(renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor('#1b150e');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 200);

  const rng = mulberry32(20120401);
  const soilHeight = makeSoilHeight(rng);
  scene.add(buildEnvironment(rng, soilHeight));
  scene.add(buildTree(rng, soilHeight));

  // 手机等小屏设备：花朵少一些、阴影贴图小一些
  const lite = touchOnly || Math.min(innerWidth, innerHeight) < 600;
  const uniforms = { uTime: { value: 0 }, uBloom: { value: reduceMotion ? 100 : -0.3 } };
  const { pads, spawnPoints } = buildBlossoms(rng, uniforms, lite ? 0.7 : 1);
  pads.forEach((p) => scene.add(p.group));
  const petals = buildPetals(rng, { soilHeight, spawnPoints, reduceMotion });
  scene.add(petals.group);

  // 灯光：左上方的暖色主光 + 背后的粉色轮廓光
  const hemi = new THREE.HemisphereLight('#ffe8c8', '#2b1e12', 1.15);
  const key = new THREE.DirectionalLight('#ffe1b8', 3.2);
  key.position.set(-6, 11, 7);
  key.target.position.set(0, 3, 0);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(lite ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 32 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight('#ffcadb', 1.1);
  rim.position.set(4, 7, -6);
  const fill = new THREE.DirectionalLight('#a9b6ff', 0.3);
  fill.position.set(7, 2, 6);
  scene.add(hemi, key, key.target, rim, fill);

  /* 取景：树和盆放在标题下方，宽屏给两侧标签留出空间 */
  const view = { cy: 3, dist: 30, H: 10 };
  const CONTENT = { top: 7.45, bottom: -1.2, width: 7.6 };
  let labelW = [];

  function fit() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const headBottom = (masthead.offsetTop + masthead.offsetHeight) / h;
    const titleFrac = Math.min(0.32, headBottom + 0.03);
    const footFrac = 0.075;
    const wFrac = w >= 1100 ? 0.52 : w >= 760 ? 0.68 : 1.05;
    let H = (CONTENT.top - CONTENT.bottom) / (1 - titleFrac - footFrac);
    H = Math.max(H, CONTENT.width / wFrac / camera.aspect);
    const mid = (CONTENT.top + CONTENT.bottom) / 2;
    const centerFrac = (footFrac + (1 - titleFrac)) / 2;
    view.cy = mid - centerFrac * H + H / 2;
    view.H = H;
    view.dist = H / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    measureLabels();
  }

  function measureLabels() {
    labelW = labels.map((el) => el.offsetWidth);
  }

  addEventListener('resize', fit);
  document.fonts?.ready.then(measureLabels);
  fit();

  /* 标签跟随花冠 */
  const v = new THREE.Vector3();
  function layoutLabels() {
    const w = innerWidth;
    const h = innerHeight;
    const margin = w < 600 ? 10 : 22;
    const gap = w < 600 ? 2 : 14;
    for (let i = 0; i < labels.length; i++) {
      const pd = pads[i + 1];
      pd.group.localToWorld(v.copy(pd.anchor));
      v.project(camera);
      const sx = (v.x * 0.5 + 0.5) * w;
      const sy = (-v.y * 0.5 + 0.5) * h;
      const lw = labelW[i] || 120;
      const x = pd.pad.side > 0 ? Math.min(sx + gap, w - margin - lw) : Math.max(sx - gap - lw, margin);
      labels[i].style.transform = `translate3d(${x.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translateY(-50%)`;
    }
  }

  /* 悬停与点击花冠 */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const proxies = pads.map((p) => p.proxy);
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(proxies, false)[0];
    return hit ? hit.object.userData.pad - 1 : -1;
  }

  let mx = 0;
  let my = 0;
  addEventListener('pointermove', (e) => {
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || panelOpen) return;
    const i = pick(e);
    setActive(i);
    canvas.style.cursor = i >= 0 ? 'pointer' : '';
  });
  canvas.addEventListener('pointerleave', () => setActive(-1));
  canvas.addEventListener('click', (e) => {
    if (panelOpen) return;
    const i = pick(e);
    if (i >= 0) follow(i);
  });

  const burstRadius = new THREE.Vector3();
  onActiveChange = (i) => {
    if (i < 0 || reduceMotion) return;
    const pd = pads[i + 1];
    burstRadius.set(pd.pad.r[0] * 0.8, pd.pad.r[1], pd.pad.r[2] * 0.7);
    petals.burst(pd.group.position, burstRadius, 12);
  };

  /* 主循环 */
  const cam = { x: 0, y: 0, shift: 0 };
  let first = true;
  let last = performance.now();
  let t = 0;

  function frame(now) {
    const dt = Math.min(Math.max(0, now - last) / 1000, 0.05);
    last = now;
    t += dt;
    uniforms.uTime.value = t;
    if (!reduceMotion) uniforms.uBloom.value += dt;
    const bloom = uniforms.uBloom.value;

    const wide = innerWidth >= 900;
    const shiftTarget = panelOpen && wide ? (Math.min(600, innerWidth) / 2 / innerHeight) * view.H : 0;
    const k = Math.min(1, dt * 2.6);
    cam.shift += (shiftTarget - cam.shift) * k;
    cam.x += ((reduceMotion ? 0 : mx * 0.35) - cam.x) * k;
    cam.y += ((reduceMotion ? 0 : -my * 0.18) - cam.y) * k;
    const elev = view.dist * 0.07;
    camera.position.set(cam.shift + cam.x, view.cy + elev + cam.y, view.dist);
    camera.lookAt(cam.shift + cam.x * 0.15, view.cy + cam.y * 0.15, 0);

    pads.forEach((pd, i) => {
      const on = i > 0 && i - 1 === active ? 1 : 0;
      const glow = pd.mat.emissiveIntensity - BLOSSOM_GLOW;
      const next = glow + (on * 0.3 - glow) * Math.min(1, dt * 7);
      pd.mat.emissiveIntensity = BLOSSOM_GLOW + next;
      pd.group.scale.setScalar(1 + next * 0.12);
      if (!reduceMotion) {
        pd.group.position.x = pd.basePos.x + Math.sin(t * 0.6 + i * 1.3) * 0.016;
        pd.group.position.y = pd.basePos.y + Math.sin(t * 0.8 + i * 1.7) * 0.01;
      }
      if (i > 0 && bloom > pd.revealAt) labels[i - 1].classList.add('is-in');
    });

    petals.update(dt, t);
    renderer.render(scene, camera);
    layoutLabels();

    if (first) {
      first = false;
      canvas.classList.add('is-ready');
      stage.classList.add('is-ready');
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
