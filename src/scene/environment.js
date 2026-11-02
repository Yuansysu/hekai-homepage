import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { woodTexture } from './textures.js';

const { lerp } = THREE.MathUtils;

// 椭圆盆：x 方向半径 SOIL_RX，z 方向压扁为 Z_SCALE
export const Z_SCALE = 0.46;
export const SOIL_RX = 2.08;
export const TABLE_Y = -1.1;

export function makeSoilHeight(rng) {
  const noise = new SimplexNoise({ random: rng });
  return (x, z) => {
    const zz = z / Z_SCALE;
    const r2 = x * x + zz * zz;
    return -0.1 + 0.24 * Math.exp(-r2 / 1.7) + noise.noise(x * 1.3, zz * 1.3) * 0.035;
  };
}

export const insidePot = (x, z, margin = 0) => {
  const zz = z / Z_SCALE;
  return x * x + zz * zz < (SOIL_RX - margin) ** 2;
};

function buildPot(rng) {
  const profile = [
    [0, -0.98],
    [1.6, -0.98],
    [1.76, -0.95],
    [1.86, -0.87],
    [1.9, -0.79],
    [1.97, -0.75],
    [1.96, -0.7],
    [2.04, -0.52],
    [2.13, -0.3],
    [2.2, -0.13],
    [2.26, -0.05],
    [2.29, 0.0],
    [2.27, 0.04],
    [2.19, 0.05],
    [2.12, 0.0],
    [2.08, -0.12],
    [1.9, -0.15],
    [0, -0.15],
  ].map(([r, y]) => new THREE.Vector2(r, y));

  // 从 π 开始旋转，让接缝落在盆背面
  const geo = new THREE.LatheGeometry(profile, 120, Math.PI, Math.PI * 2);
  geo.scale(1, 1, Z_SCALE);
  geo.computeVertexNormals();

  const noise = new SimplexNoise({ random: rng });
  const p = geo.attributes.position;
  const colors = new Float32Array(p.count * 3);
  const glaze = new THREE.Color('#86a68e');
  const pool = new THREE.Color('#4f6b58');
  const rim = new THREE.Color('#a09a7b');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const n = noise.noise3d(x * 2.2, y * 3.5, z * 2.2) * 0.5 + noise.noise3d(x * 9, y * 9, z * 9) * 0.2;
    c.copy(glaze).lerp(pool, Math.min(1, Math.max(0, (-0.55 - y) * 1.6)) * 0.8 + n * 0.25);
    if (y > -0.06) c.lerp(rim, 0.45);
    c.multiplyScalar(0.92 + n * 0.12);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    vertexColors: true,
    roughness: 0.34,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.28,
  });
  const pot = new THREE.Mesh(geo, mat);
  pot.castShadow = true;
  pot.receiveShadow = true;

  const group = new THREE.Group();
  group.add(pot);

  // 四只盆足
  const footGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.13, 20);
  const footMat = new THREE.MeshStandardMaterial({ color: '#4f6656', roughness: 0.5 });
  for (const [x, z] of [
    [-1.2, -0.36],
    [1.2, -0.36],
    [-1.2, 0.36],
    [1.2, 0.36],
  ]) {
    const f = new THREE.Mesh(footGeo, footMat);
    f.position.set(x, -1.04, z);
    f.scale.z = 0.8;
    f.castShadow = true;
    group.add(f);
  }
  return group;
}

function buildSoil(rng, soilHeight) {
  const R = 22;
  const S = 84;
  const pos = [];
  const col = [];
  const idx = [];
  const noise = new SimplexNoise({ random: rng });
  const soil = new THREE.Color('#3b2c1f');
  const moss = new THREE.Color('#5b6a2c');
  const mossLight = new THREE.Color('#7b8338');
  const c = new THREE.Color();

  const push = (x, z) => {
    const y = soilHeight(x, z);
    pos.push(x, y, z);
    const n = noise.noise(x * 2.4, z * 4);
    const n2 = noise.noise(x * 9, z * 14);
    c.copy(soil).lerp(moss, THREE.MathUtils.smoothstep(n, -0.5, 0.2)).lerp(mossLight, Math.max(0, n2) * 0.35);
    col.push(c.r, c.g, c.b);
  };

  push(0, 0);
  for (let ri = 1; ri <= R; ri++) {
    const rr = (ri / R) * (SOIL_RX + 0.02);
    for (let s = 0; s < S; s++) {
      const a = (s / S) * Math.PI * 2;
      push(Math.cos(a) * rr, Math.sin(a) * rr * Z_SCALE);
    }
  }
  for (let s = 0; s < S; s++) idx.push(0, 1 + ((s + 1) % S), 1 + s);
  for (let ri = 1; ri < R; ri++) {
    const a0 = 1 + (ri - 1) * S;
    const b0 = 1 + ri * S;
    for (let s = 0; s < S; s++) {
      const s1 = (s + 1) % S;
      idx.push(a0 + s, a0 + s1, b0 + s, a0 + s1, b0 + s1, b0 + s);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  mesh.receiveShadow = true;

  // 青苔团
  const mossGeo = new THREE.IcosahedronGeometry(1, 2);
  const mossColors = ['#3f4a22', '#4c5928', '#59642f', '#36401c', '#646a34', '#4a4a26'].map((h) => new THREE.Color(h));
  const N = 260;
  const clumps = new THREE.InstancedMesh(mossGeo, new THREE.MeshStandardMaterial({ roughness: 1 }), N);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  for (let i = 0; i < N; i++) {
    let x, z;
    do {
      x = (rng() * 2 - 1) * SOIL_RX;
      z = (rng() * 2 - 1) * SOIL_RX * Z_SCALE;
    } while (!insidePot(x, z, 0.12));
    const sx = 0.05 + rng() * 0.1;
    const y = soilHeight(x, z) - sx * 0.15;
    q.setFromEuler(e.set(0, rng() * Math.PI, 0));
    m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sx * (0.35 + rng() * 0.3), sx * (0.8 + rng() * 0.4)));
    clumps.setMatrixAt(i, m);
    clumps.setColorAt(i, mossColors[Math.floor(rng() * mossColors.length)]);
  }
  clumps.receiveShadow = true;

  const g = new THREE.Group();
  g.add(mesh, clumps);
  return g;
}

function buildTable(rng) {
  const tex = woodTexture(rng);
  tex.repeat.set(4, 1);
  const geo = new THREE.BoxGeometry(60, 8, 10);
  const mat = new THREE.MeshStandardMaterial({ map: tex, color: '#948471', roughness: 0.55, metalness: 0 });
  const table = new THREE.Mesh(geo, mat);
  table.position.set(0, TABLE_Y - 4, 0.4);
  table.receiveShadow = true;
  return table;
}

/** 背景墙：粗糙灰泥 + 左上角打下的暖色光斑（直接输出显示色） */
function buildWall() {
  const mat = new THREE.ShaderMaterial({
    toneMapped: false,
    depthWrite: false,
    uniforms: {},
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vW;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float s = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
        return s;
      }
      void main() {
        vec2 p = vW.xy;
        float n = fbm(p * 0.8) * 0.55 + fbm(p * 3.6 + 7.0) * 0.45;
        vec2 c = vec2(-2.2, 6.4);
        float d = length((p - c) * vec2(0.6, 0.78));
        float spot = smoothstep(7.8, 0.3, d);
        // 斜向光束的边缘：右下更暗
        float beam = smoothstep(-5.0, 3.0, -(p.x * 0.75 + (p.y - 6.0) * -0.55) + 1.0);
        float light = spot * (0.55 + 0.45 * beam);
        vec3 dark = vec3(0.095, 0.074, 0.048);
        vec3 lit = vec3(0.46, 0.37, 0.225);
        vec3 col = mix(dark, lit, light);
        col *= 0.8 + 0.4 * n;
        col *= mix(0.75, 1.0, smoothstep(-3.0, 4.0, p.y));
        col += (hash(gl_FragCoord.xy) - 0.5) * 0.018;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), mat);
  wall.position.set(0, 8, -4.65);
  return wall;
}

export function buildEnvironment(rng, soilHeight) {
  const group = new THREE.Group();
  group.add(buildWall(), buildTable(rng), buildPot(rng), buildSoil(rng, soilHeight));
  return group;
}
