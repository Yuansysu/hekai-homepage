import * as THREE from 'three';
import { TABLE_Y, insidePot, Z_SCALE, SOIL_RX } from './environment.js';

function petalGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.045, 0.015, 0.062, 0.07, 0.036, 0.11);
  s.lineTo(0, 0.094);
  s.lineTo(-0.036, 0.11);
  s.bezierCurveTo(-0.062, 0.07, -0.045, 0.015, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 6);
  const p = geo.attributes.position;
  const colors = new Float32Array(p.count * 3);
  const base = new THREE.Color('#fff6f8');
  const tip = new THREE.Color('#f3a9c0');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    p.setZ(i, x * x * 7 - y * 0.12); // 轻微卷曲
    c.copy(base).lerp(tip, Math.min(1, y / 0.11));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.translate(0, -0.055, 0);
  geo.computeVertexNormals();
  return geo;
}

export function buildPetals(rng, { soilHeight, spawnPoints, count = 170, settled = 110, reduceMotion = false }) {
  const geo = petalGeometry();
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.6,
    emissive: '#e9a3b7',
    emissiveIntensity: 0.22,
  });
  const group = new THREE.Group();

  const floorAt = (x, z) => {
    if (insidePot(x, z, 0.05)) return soilHeight(x, z);
    if (insidePot(x, z, -0.24)) return 0.04; // 盆沿
    return TABLE_Y;
  };
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();

  // 已落下的花瓣：盆土与桌面上
  const rest = new THREE.InstancedMesh(geo, mat, settled);
  for (let i = 0; i < settled; i++) {
    let x, z;
    if (i < settled * 0.45) {
      do {
        x = (rng() * 2 - 1) * SOIL_RX;
        z = (rng() * 2 - 1) * SOIL_RX * Z_SCALE;
      } while (!insidePot(x, z, 0.15));
    } else {
      do {
        x = (rng() * 2 - 1) * 5.5;
        z = -1.2 + rng() * 4.2;
      } while (insidePot(x, z, -0.3));
    }
    dummy.position.set(x, floorAt(x, z) + 0.012, z);
    dummy.rotation.set(-Math.PI / 2 + (rng() - 0.5) * 0.5, (rng() - 0.5) * 0.4, rng() * Math.PI * 2);
    dummy.scale.setScalar(0.9 + rng() * 0.5);
    dummy.updateMatrix();
    rest.setMatrixAt(i, dummy.matrix);
    rest.setColorAt(i, tint.setScalar(0.75 + rng() * 0.25));
  }
  rest.receiveShadow = true;
  group.add(rest);

  // 飘落中的花瓣
  const fall = new THREE.InstancedMesh(geo, mat, count);
  fall.frustumCulled = false;
  const st = Array.from({ length: count }, () => ({
    p: new THREE.Vector3(),
    v: new THREE.Vector3(),
    r: new THREE.Euler(),
    spin: new THREE.Vector3(),
    phase: 0,
    scale: 1,
  }));

  function respawn(s, initial = false, from = null) {
    if (from) {
      s.p.copy(from);
    } else if (spawnPoints.length && rng() < 0.45) {
      s.p.copy(spawnPoints[Math.floor(rng() * spawnPoints.length)]);
    } else {
      s.p.set((rng() * 2 - 1) * 9, 8.5 + rng() * 3, -3 + rng() * 6.5);
    }
    if (initial) s.p.y = TABLE_Y + rng() * 10;
    s.v.set(0, -(0.32 + rng() * 0.3), 0);
    s.r.set(rng() * 6.28, rng() * 6.28, rng() * 6.28);
    s.spin.set((rng() - 0.5) * 3, (rng() - 0.5) * 3, (rng() - 0.5) * 2);
    s.phase = rng() * 100;
    s.scale = 1 + rng() * 0.45;
  }
  st.forEach((s, i) => {
    respawn(s, true);
    fall.setColorAt(i, tint.setScalar(0.85 + rng() * 0.15));
  });
  group.add(fall);

  let next = 0;
  function burst(center, radius, n = 14) {
    for (let k = 0; k < n; k++) {
      const s = st[next];
      next = (next + 1) % count;
      respawn(s, false, center.clone().add(new THREE.Vector3((rng() * 2 - 1) * radius.x, (rng() - 0.3) * radius.y, (rng() * 2 - 1) * radius.z)));
      s.v.x = (rng() - 0.5) * 0.8;
      s.v.y = -(0.15 + rng() * 0.25);
    }
  }

  function write() {
    st.forEach((s, i) => {
      dummy.position.copy(s.p);
      dummy.rotation.copy(s.r);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      fall.setMatrixAt(i, dummy.matrix);
    });
    fall.instanceMatrix.needsUpdate = true;
  }

  function update(dt, t) {
    if (reduceMotion) return;
    const wind = 0.16 + Math.sin(t * 0.21) * 0.1;
    for (const s of st) {
      s.v.x += (wind - s.v.x) * dt * 0.6;
      s.p.x += (s.v.x + Math.sin(t * 0.9 + s.phase) * 0.32) * dt;
      s.p.y += (s.v.y + Math.sin(t * 1.7 + s.phase) * 0.08) * dt;
      s.p.z += Math.cos(t * 0.7 + s.phase) * 0.12 * dt;
      s.r.x += s.spin.x * dt;
      s.r.y += s.spin.y * dt;
      s.r.z += s.spin.z * dt;
      if (s.p.y < floorAt(s.p.x, s.p.z) + 0.02 || s.p.x > 11) respawn(s);
    }
    write();
  }

  write();
  return { group, update, burst };
}
