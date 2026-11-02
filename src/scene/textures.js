import * as THREE from 'three';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

/** 五瓣樱花（带缺刻的花瓣、花心与花蕊），用作花冠里每朵花的贴图 */
export function blossomTexture() {
  const S = 128;
  const [c, g] = canvas(S, S);
  g.translate(S / 2, S / 2);

  for (let i = 0; i < 5; i++) {
    g.save();
    g.rotate((i * Math.PI * 2) / 5);
    const grad = g.createLinearGradient(0, 0, 0, -60);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#fff1f5');
    grad.addColorStop(1, '#f6b3c6');
    g.fillStyle = grad;
    g.beginPath();
    g.moveTo(0, -3);
    g.bezierCurveTo(-27, -12, -31, -47, -11, -59);
    g.lineTo(0, -51);
    g.lineTo(11, -59);
    g.bezierCurveTo(31, -47, 27, -12, 0, -3);
    g.fill();
    g.strokeStyle = 'rgba(220,120,150,0.28)';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(0, -8);
    g.lineTo(0, -40);
    g.stroke();
    g.restore();
  }

  const core = g.createRadialGradient(0, 0, 0, 0, 0, 13);
  core.addColorStop(0, '#b8355c');
  core.addColorStop(1, 'rgba(236,140,168,0)');
  g.fillStyle = core;
  g.beginPath();
  g.arc(0, 0, 13, 0, Math.PI * 2);
  g.fill();

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const r = 12 + (i % 3) * 3;
    g.strokeStyle = 'rgba(190,70,100,0.75)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    g.stroke();
    g.fillStyle = '#f2cf78';
    g.beginPath();
    g.arc(Math.cos(a) * r, Math.sin(a) * r, 1.7, 0, Math.PI * 2);
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** 无缝的纵向树皮纹理：深色裂纹 + 浅色脊线 */
export function barkTexture(rng) {
  const W = 256;
  const H = 512;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#8a705b';
  g.fillRect(0, 0, W, H);

  // 大块明暗斑驳
  for (let i = 0; i < 90; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const r = 10 + rng() * 40;
    const light = rng() < 0.5;
    for (const dx of [-W, 0, W]) {
      for (const dy of [-H, 0, H]) {
        const grd = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        grd.addColorStop(0, light ? 'rgba(150,124,100,0.25)' : 'rgba(40,28,20,0.25)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grd;
        g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
  }

  // 纵向裂纹
  for (let i = 0; i < 240; i++) {
    const x = rng() * W;
    const y = rng() * H;
    const len = 40 + rng() * 260;
    const dark = rng() < 0.6;
    const pts = [];
    let cx = x;
    for (let s = 0; s <= len; s += 10) {
      cx += (rng() - 0.5) * 4;
      pts.push([cx, y + s]);
    }
    g.strokeStyle = dark ? `rgba(28,18,12,${0.3 + rng() * 0.45})` : `rgba(170,142,116,${0.15 + rng() * 0.25})`;
    g.lineWidth = dark ? 1 + rng() * 3.2 : 0.8 + rng() * 1.8;
    for (const dx of [-W, 0, W]) {
      for (const dy of [-H, 0, H]) {
        g.beginPath();
        pts.forEach(([px, py], k) => (k ? g.lineTo(px + dx, py + dy) : g.moveTo(px + dx, py + dy)));
        g.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** 深色木纹桌面 */
export function woodTexture(rng) {
  const W = 1024;
  const H = 256;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#3a2a1d';
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) {
    const y = rng() * H;
    const amp = 2 + rng() * 6;
    const f = 0.002 + rng() * 0.006;
    const ph = rng() * 10;
    g.strokeStyle = rng() < 0.6 ? `rgba(20,12,8,${0.15 + rng() * 0.3})` : `rgba(110,84,60,${0.08 + rng() * 0.15})`;
    g.lineWidth = 0.6 + rng() * 2;
    g.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const yy = y + Math.sin(x * f * Math.PI * 2 + ph) * amp;
      x ? g.lineTo(x, yy) : g.moveTo(x, yy);
    }
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}
