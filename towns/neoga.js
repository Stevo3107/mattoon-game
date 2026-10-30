// ---------------------------------------------------------------- Neoga (stub, Oct 30): straight main, yard limit board, "under construction".
// Only here so the Mattoon <-> Neoga trip works. Track, customers and art come when Stephen designs the town.
window.NII_TOWN_STUB = function (NII) {
  'use strict';
  const $ = id => document.getElementById(id), C = window.NII_CORE, e = NII.env(), M = e.towns.mattoon || {};
  const nb = e.towns.neoga || (e.towns.neoga = { v: 1, train: [], arrived: 0 });
  if (e.trainIn) { nb.train = e.trainIn; nb.arrived = e.time; NII.trainDelivered(); } // train is now in Neoga
  e.towns.neoga = nb; NII.write();
  for (const id of ['jobbar', 'panel', 'sceneBtns', 'speedBtn', 'restartBtn', 'menuBtn', 'mapwrap']) { const el = $(id); if (el) el.style.display = 'none'; }
  const clock = t => { const h = Math.floor(t % 86400 / 3600), m = Math.floor(t / 60) % 60; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
  $('cash').textContent = '$' + Math.round(M.money || 0).toLocaleString('en-US'); $('rep').textContent = M.rep != null ? M.rep : 0;
  $('clock').textContent = clock(e.time || M.time || 0); $('day').textContent = 'Day ' + (Math.floor((e.time || 0) / 86400) + 1) + ' · Neoga';
  const wrap = $('scenewrap'), cv = $('scene'), g = cv.getContext('2d'), IM = {};
  const pic = k => { if (IM[k] !== undefined) return IM[k]; const a = C.ART[k]; if (!a) return (IM[k] = null); const i = new Image(); i.onload = draw; i.src = a.src; return (IM[k] = i); };
  const ylb = (() => { const s = C.BART && C.BART['yard-limit-sign']; if (!s) return null; const i = new Image(); i.onload = draw; i.src = s; return i; })();
  const bar = document.createElement('div'); bar.id = 'neogaBar';
  bar.innerHTML = `<div><b>Neoga</b>: under construction. The town gets its track and customers next.</div><button id="goNorth">◀ North to Mattoon</button>`;
  wrap.appendChild(bar);
  let roll = 0, rolling = false;
  function draw() {
    const W = wrap.clientWidth, H = wrap.clientHeight, dpr = window.devicePixelRatio || 1; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#b9cde0'); sky.addColorStop(1, '#e7e2cf'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const ry = Math.round(H * 0.62); g.fillStyle = '#8b9a5b'; g.fillRect(0, ry - 30, W, H); g.fillStyle = '#a89f8c'; g.fillRect(0, ry - 6, W, 16);
    g.fillStyle = '#5a4634'; for (let x = 0; x < W; x += 9) g.fillRect(x, ry - 2, 5, 8); g.fillStyle = '#555'; g.fillRect(0, ry - 3, W, 2); g.fillRect(0, ry + 4, W, 2);
    const len = nb.train.reduce((a, v) => a + (v.L || 50), 0) || 60, ppf = Math.min(4, (W * 0.8) / Math.max(len, 200));
    // yard limit board (south of the train) and the under-construction board
    const yx = W * 0.88; if (ylb && ylb.naturalWidth) { const h = 70, w = ylb.naturalWidth / ylb.naturalHeight * h; g.drawImage(ylb, yx - w / 2, ry - 16 - h, w, h); }
    else { g.fillStyle = '#444'; g.fillRect(yx - 2, ry - 70, 4, 56); g.fillStyle = '#f4f1ea'; g.fillRect(yx - 26, ry - 86, 52, 28); g.fillStyle = '#111'; g.font = '700 10px Arial'; g.textAlign = 'center'; g.fillText('YARD', yx, ry - 74); g.fillText('LIMIT', yx, ry - 62); }
    g.fillStyle = '#e8c547'; g.fillRect(W * 0.62 - 70, ry - 120, 140, 40); g.strokeStyle = '#222'; g.lineWidth = 2; g.strokeRect(W * 0.62 - 70, ry - 120, 140, 40); g.fillStyle = '#5a4634'; g.fillRect(W * 0.62 - 50, ry - 80, 4, 50); g.fillRect(W * 0.62 + 46, ry - 80, 4, 50);
    g.fillStyle = '#111'; g.textAlign = 'center'; g.font = '800 14px Arial'; g.fillText('NEOGA', W * 0.62, ry - 103); g.font = '700 10px Arial'; g.fillText('UNDER CONSTRUCTION', W * 0.62, ry - 89);
    g.font = '700 12px Arial'; g.fillStyle = '#333'; g.textAlign = 'left'; g.fillText('◀ N to Mattoon', 8, ry + 30); g.textAlign = 'right'; g.fillText('S to Effingham ▶', W - 8, ry + 30);
    let x = W * 0.08 - roll;
    for (const v of nb.train) { const L = (v.L || 50) * ppf, im = pic(v.art || v.type);
      if (im && im.naturalWidth) { const h = im.naturalHeight / im.naturalWidth * L; g.save(); if (v.aFrontN === false) { g.translate(x + L, 0); g.scale(-1, 1); g.drawImage(im, 0, ry - h + 2, L, h); } else g.drawImage(im, x, ry - h + 2, L, h); g.restore(); }
      else { g.fillStyle = '#3a3f4a'; g.fillRect(x + 1, ry - 12 * ppf, L - 2, 10 * ppf); }
      x += L; }
    if (!nb.train.length) { g.fillStyle = '#333'; g.font = '13px Arial'; g.textAlign = 'center'; g.fillText('No train here.', W / 2, ry - 40); }
  }
  window.addEventListener('resize', draw); draw();
  $('goNorth').onclick = () => { if (rolling) return; if (!nb.train.length) { NII.env().town = 'mattoon'; NII.write(); location.reload(); return; } rolling = true; const t0 = performance.now();
    const step = t => { roll = Math.pow((t - t0) / 1400, 2) * wrap.clientWidth; draw(); if (t - t0 < 1400) requestAnimationFrame(step); else go(); }; requestAnimationFrame(step); };
  function go() { const tr = nb.train; nb.train = []; NII.travel('neoga', 'mattoon', tr); }
  window.__neoga = { go, get train() { return nb.train; } };
};
