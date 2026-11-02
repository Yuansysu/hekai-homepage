import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { blossomTexture, barkTexture } from './textures.js';

const { lerp } = THREE.MathUtils;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 花冠（云片）：c 为中心，r 为三个方向的半径，side 表示链接标签挂在左（-1）还是右（1）。
 * PADS[0] 是树顶，不挂链接；PADS[1..8] 与 content.js 里的 LINKS 一一对应。
 */
export const PADS = [
  { c: [0.12, 6.82, 0.0], r: [1.0, 0.45, 0.78], side: 0 },
  { c: [1.62, 6.02, 0.1], r: [1.22, 0.46, 0.84], side: 1 },
  { c: [-1.66, 5.3, 0.12], r: [1.32, 0.49, 0.9], side: -1 },
  { c: [1.95, 4.52, 0.0], r: [1.38, 0.49, 0.94], side: 1 },
  { c: [-1.94, 3.8, 0.15], r: [1.42, 0.52, 0.96], side: -1 },
  { c: [2.08, 3.04, 0.1], r: [1.38, 0.49, 0.94], side: 1 },
  { c: [-2.02, 2.3, 0.1], r: [1.36, 0.49, 0.94], side: -1 },
  { c: [1.82, 1.56, 0.2], r: [1.2, 0.46, 0.9], side: 1 },
  { c: [-1.62, 0.98, 0.25], r: [1.1, 0.44, 0.84], side: -1 },
];

const TRUNK_POINTS = [
  [0.38, -0.25, 0.0],
  [0.18, 0.45, 0.12],
  [-0.32, 1.25, 0.1],
  [-0.22, 2.05, -0.05],
  [0.32, 2.85, 0.0],
  [0.38, 3.65, 0.1],
  [-0.08, 4.45, 0.05],
  [-0.28, 5.2, 0.0],
  [0.02, 5.9, 0.05],
  [0.15, 6.62, 0.0],
];

const trunkRadius = (t) => lerp(0.52, 0.1, Math.pow(t, 0.85)) + 0.34 * Math.exp(-t * 20);

/** 沿曲线生成渐细、带树皮起伏的管子 */
function taperedTube(curve, noise, { tubular, radial, radius, gnarl = 0.1, moss = 0, seed = 0 }) {
  const frames = curve.computeFrenetFrames(tubular, false);
  const len = curve.getLength();
  const ring = radial + 1;
  const count = (tubular + 1) * ring;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const P = new THREE.Vector3();
  const D = new THREE.Vector3();
  const avgR = radius(0.5);
  const uScale = Math.max(1, Math.round((Math.PI * 2 * avgR) / 0.9));

  let k = 0;
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = radius(t);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      D.copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
      // 缓慢螺旋的纵向棱脊 + 大尺度的瘤状起伏
      const tw = a + t * len * 0.35;
      const ridge = noise.noise3d(Math.cos(tw) * 1.8 + seed, Math.sin(tw) * 1.8, t * len * 0.45);
      const lump = noise.noise3d(P.x * 0.9 + seed * 3.1, P.y * 0.9, P.z * 0.9);
      const rr = r * (1 + gnarl * (ridge * 0.65 + lump * 0.35));
      pos[k * 3] = P.x + D.x * rr;
      pos[k * 3 + 1] = P.y + D.y * rr;
      pos[k * 3 + 2] = P.z + D.z * rr;

      let shade = 0.8 + 0.3 * ridge;
      let cr = shade;
      let cg = shade * 0.97;
      let cb = shade * 0.94;
      if (moss > 0) {
        const m = Math.max(0, 1 - t / moss) * (0.45 + 0.55 * Math.max(0, lump + 0.3));
        cr = lerp(cr, 0.55, m);
        cg = lerp(cg, 0.72, m);
        cb = lerp(cb, 0.36, m);
      }
      col[k * 3] = cr;
      col[k * 3 + 1] = cg;
      col[k * 3 + 2] = cb;
      uv[k * 2] = (j / radial) * uScale;
      uv[k * 2 + 1] = (t * len) / 1.7;
      k++;
    }
  }

  const idx = [];
  for (let i = 0; i < tubular; i++) {
    for (let j = 0; j < radial; j++) {
      const a = ring * i + j;
      const b = ring * (i + 1) + j;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  // 接缝两侧的法线取平均，避免出现一条亮线
  const n = geo.attributes.normal;
  const v = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const a = i * ring;
    const b = a + radial;
    v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, v.x, v.y, v.z);
    n.setXYZ(b, v.x, v.y, v.z);
  }
  return geo;
}

const V = (x, y, z) => new THREE.Vector3(x, y, z);

export function buildTree(rng, soilHeight) {
  const noise = new SimplexNoise({ random: rng });
  const parts = [];
  const tube = (curve, opts) => parts.push(taperedTube(curve, noise, { seed: rng() * 50, ...opts }));

  const trunk = new THREE.CatmullRomCurve3(TRUNK_POINTS.map((p) => V(...p)), false, 'catmullrom', 0.5);
  tube(trunk, { tubular: 180, radial: 22, radius: trunkRadius, gnarl: 0.17, moss: 0.12 });

  // 根盘（nebari）
  const base = trunk.getPointAt(0.04);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + rng() * 0.6;
    const dx = Math.cos(a);
    const dz = Math.sin(a) * 0.55;
    const reach = 0.7 + rng() * 0.5;
    const end = V(base.x + dx * reach, 0, base.z + dz * reach);
    end.y = soilHeight(end.x, end.z) - 0.06;
    const mid = V(base.x + dx * reach * 0.45, 0, base.z + dz * reach * 0.45);
    mid.y = soilHeight(mid.x, mid.z) + 0.03;
    const start = base.clone().add(V(dx * 0.1, 0.05, dz * 0.1));
    tube(new THREE.CatmullRomCurve3([start, mid, end]), {
      tubular: 18,
      radial: 10,
      radius: (t) => lerp(0.2, 0.03, Math.pow(t, 0.7)),
      gnarl: 0.15,
      moss: 1.4,
    });
  }

  // 主枝与细枝
  const samples = trunk.getSpacedPoints(400);
  const twigEnds = [];
  PADS.forEach((pad, i) => {
    const C = V(...pad.c);
    let E;
    if (i === 0) {
      E = trunk.getPointAt(1);
    } else {
      const targetY = C.y - 0.58;
      let best = 0;
      for (let k = 0; k < samples.length; k++) {
        if (Math.abs(samples[k].y - targetY) < Math.abs(samples[best].y - targetY)) best = k;
      }
      const t0 = best / (samples.length - 1);
      const S = samples[best].clone();
      E = C.clone().add(V(-pad.side * pad.r[0] * 0.2, -pad.r[1] * 0.4, 0));
      const M1 = S.clone().lerp(E, 0.35).add(V(0, -0.06 + rng() * 0.1, (rng() - 0.5) * 0.25));
      const M2 = S.clone().lerp(E, 0.7).add(V(0, 0.1 + rng() * 0.12, (rng() - 0.5) * 0.25));
      const r0 = trunkRadius(t0) * 0.68;
      tube(new THREE.CatmullRomCurve3([S, M1, M2, E]), {
        tubular: 40,
        radial: 12,
        radius: (t) => lerp(r0, 0.06, Math.pow(t, 0.7)),
        gnarl: 0.14,
      });
    }

    const nTwigs = 6 + Math.round(pad.r[0] * 2);
    for (let k = 0; k < nTwigs; k++) {
      const end = C.clone().add(
        V((rng() * 2 - 1) * pad.r[0] * 0.85, (rng() - 0.25) * pad.r[1] * 0.55, (rng() * 2 - 1) * pad.r[2] * 0.7),
      );
      const mid = E.clone().lerp(end, 0.5).add(V(0, -0.04 - rng() * 0.08, 0));
      tube(new THREE.CatmullRomCurve3([E.clone(), mid, end]), {
        tubular: 12,
        radial: 6,
        radius: (t) => lerp(0.04, 0.01, t),
        gnarl: 0.06,
      });
      twigEnds.push(end);
    }
  });

  const geo = mergeGeometries(parts);
  const bark = barkTexture(rng);
  const mat = new THREE.MeshStandardMaterial({
    map: bark,
    bumpMap: bark,
    bumpScale: 2.2,
    roughness: 0.92,
    metalness: 0,
    vertexColors: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* ---------------- 樱花花冠 ---------------- */

function hookBlossomShader(mat, uniforms) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uBloom = uniforms.uBloom;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aDelay;
        uniform float uTime;
        uniform float uBloom;
        float easeOutBack(float x) {
          const float c1 = 1.70158;
          const float c3 = c1 + 1.0;
          return 1.0 + c3 * pow(x - 1.0, 3.0) + c1 * pow(x - 1.0, 2.0);
        }`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float bk = clamp((uBloom - aDelay) / 0.9, 0.0, 1.0);
        transformed *= bk > 0.0 ? easeOutBack(bk) : 0.0;`,
      )
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
          vec3 ip = instanceMatrix[3].xyz;
          float w = sin(uTime * 1.6 + ip.x * 2.3 + ip.z * 1.7) * 0.012 + sin(uTime * 2.7 + ip.y * 3.1) * 0.006;
          mvPosition.xyz += vec3(w, w * 0.5, w * 0.7);
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;`,
      );
  };
  mat.customProgramCacheKey = () => 'sakura-blossom';
}

/** 花冠底色的自发光（让背光面不至于发灰），悬停时在此基础上增强 */
export const BLOSSOM_GLOW = 0.07;

function randomDir(rng, out) {
  let x, y, z, l;
  do {
    x = rng() * 2 - 1;
    y = rng() * 2 - 1;
    z = rng() * 2 - 1;
    l = x * x + y * y + z * z;
  } while (l > 1 || l < 1e-4);
  return out.set(x, y, z).divideScalar(Math.sqrt(l));
}

export function buildBlossoms(rng, uniforms, density = 1) {
  const tex = blossomTexture();
  const quad = new THREE.PlaneGeometry(1, 1);
  const palette = ['#fff0f4', '#ffe1ea', '#fdd0dd', '#f9c0d0', '#f5b0c4', '#f2a5bb'].map((c) => new THREE.Color(c));
  const shadowTint = new THREE.Color('#c25f82');
  const budColor = new THREE.Color('#e06f93');

  const Z = V(0, 0, 1);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const q2 = new THREE.Quaternion();
  const pos = V(0, 0, 0);
  const nrm = V(0, 0, 0);
  const dir = V(0, 0, 0);
  const scl = V(1, 1, 1);
  const col = new THREE.Color();
  const bias = V(0, 0.45, 0.3);

  const spawnPoints = [];

  const pads = PADS.map((pad, pi) => {
    const [rx, ry, rz] = pad.r;
    const group = new THREE.Group();
    group.position.fromArray(pad.c);

    // 每簇花冠由若干个“小云团”组成，沿 x 方向分层分布
    const nP = Math.round(4 + rx * 3.2);
    const puffs = [];
    const sizeK = Math.min(1.2, 0.8 + rx * 0.25);
    for (let k = 0; k < nP; k++) {
      const fx = ((k + 0.2 + rng() * 0.6) / nP) * 2 - 1;
      const edge = 1 - fx * fx;
      puffs.push({
        p: V(fx * rx * 0.78, (rng() * 2 - 1) * ry * 0.18 + edge * ry * 0.2, (rng() * 2 - 1) * rz * 0.5),
        r: (0.33 + rng() * 0.14 + edge * 0.14) * sizeK,
      });
    }
    // 前后补两团增加厚度，顶上再叠几团小的，做出“菜花”状的起伏
    for (let k = 0; k < 2; k++) {
      puffs.push({ p: V((rng() * 2 - 1) * rx * 0.4, ry * 0.05, (k ? 1 : -1) * rz * 0.5), r: (0.36 + rng() * 0.1) * sizeK });
    }
    const nTop = Math.round(2 + rx * 2);
    for (let k = 0; k < nTop; k++) {
      const fx = ((k + 0.5) / nTop) * 2 - 1;
      puffs.push({
        p: V(fx * rx * 0.55 + (rng() - 0.5) * 0.2, ry * (0.45 + rng() * 0.25), (rng() * 2 - 1) * rz * 0.35),
        r: (0.22 + rng() * 0.1) * sizeK,
      });
    }

    const count = Math.round((1700 * density * (rx * rz)) / (1.2 * 0.85));
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      roughness: 0.72,
      metalness: 0,
      emissive: new THREE.Color('#ff94b4'),
      emissiveIntensity: BLOSSOM_GLOW,
    });
    mat.alphaToCoverage = true;
    hookBlossomShader(mat, uniforms);

    const geo = quad.clone();
    const delays = new Float32Array(count);
    const mesh = new THREE.InstancedMesh(geo, mat, count);
    const padHeight = pi === 0 ? 7.2 : pad.c[1];
    const baseDelay = 0.2 + (padHeight / 7.2) * 1.5;

    for (let i = 0; i < count; i++) {
      const pf = puffs[Math.floor(rng() * puffs.length)];
      randomDir(rng, dir);
      const inner = rng() < 0.2;
      const depth = inner ? 0.45 + rng() * 0.3 : 0.84 + rng() * 0.2;
      pos.set(pf.p.x + dir.x * pf.r * depth, pf.p.y + dir.y * pf.r * depth * 0.72, pf.p.z + dir.z * pf.r * depth);

      nrm.copy(dir).add(bias).normalize();
      q.setFromUnitVectors(Z, nrm);
      q2.setFromAxisAngle(nrm, rng() * Math.PI * 2);
      q.premultiply(q2);
      const bud = rng() < 0.06;
      const s = (bud ? 0.07 + rng() * 0.03 : 0.11 + rng() * 0.07) / Math.sqrt(density);
      scl.set(s, s, s);
      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);

      const up = dir.y * 0.5 + 0.5;
      let lum = 0.45 + 0.55 * Math.pow(up, 0.7);
      if (inner) lum *= 0.65;
      col.copy(bud ? budColor : palette[Math.floor(rng() * palette.length)]);
      col.lerp(shadowTint, (1 - lum) * 0.8);
      col.multiplyScalar(0.72 + 0.28 * lum);
      mesh.setColorAt(i, col);

      const spread = Math.abs(pos.x) / (rx + 0.4);
      delays[i] = baseDelay + spread * 0.5 + rng() * 0.7;

      if (!inner && dir.y > -0.2 && rng() < 0.06) spawnPoints.push(pos.clone().add(group.position));
    }
    geo.setAttribute('aDelay', new THREE.InstancedBufferAttribute(delays, 1));
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.frustumCulled = false;
    group.add(mesh);

    // 鼠标拾取用的不可见椭球
    const proxy = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.scale.set(rx + 0.25, ry + 0.3, rz + 0.25);
    proxy.userData.pad = pi;
    group.add(proxy);

    // 标签锚点：花冠最外侧
    let outer = 0;
    if (pad.side) {
      for (const pf of puffs) outer = Math.max(outer, pad.side * pf.p.x + pf.r * 0.95);
    }
    const anchor = V(pad.side * outer, 0.04, 0);

    return {
      pad,
      group,
      mesh,
      mat,
      proxy,
      anchor,
      basePos: group.position.clone(),
      revealAt: baseDelay + 0.55,
      center: V(...pad.c),
    };
  });

  return { pads, spawnPoints };
}
