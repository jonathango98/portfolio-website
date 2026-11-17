/**
 * Rover: a rescue rover in a damaged room, an aid kit under its arm's magnet. The pointer sets a
 * goal on the floor; the rover plans A* over a grid inflated round the rubble, lays the route as a
 * dashed line, and drives it. Leave, and it drives home. The slider is the inflation.
 * The pattern: a field of one point. A hit test on the floor plane; springs on path distance and heading.
 */
const { Cam, circ, clamp, fillet, fit, flatDot, hull, mk, open, place, poly, prism, proj, put, rings,
  rrect, solid, spring, stepS, facing, pointer, register, disposer, unproj, rad } = HL;

// Room half sizes, wall height, grid cell, and the rover's own clearance (its inscribed radius).
const RX = 64, RY = 50, WH = 16, CELL = 4, BODY = 10;
const RUBBLE = [ // centre, half sizes, turn, height
  { x: 12, y: -6, a: 6, b: 5, t: rad(24), h: 12 },
  { x: -16, y: 40, a: 15, b: 3, t: rad(-20), h: 5 },
  { x: 44, y: -42, a: 6, b: 4, t: rad(-12), h: 4 },
];
const HOME = { x: -40, y: 2, th: rad(18) };
const NX = Math.round((2 * RX) / CELL) + 1, NY = Math.round((2 * RY) / CELL) + 1;
const cx = (i) => -RX + (i % NX) * CELL, cy = (i) => -RY + Math.floor(i / NX) * CELL;

/** Distance from (px, py) to rubble r's footprint. */
function gap(r, px, py) {
  const dx = px - r.x, dy = py - r.y, c = Math.cos(r.t), s = Math.sin(r.t);
  return Math.hypot(Math.max(Math.abs(dx * c + dy * s) - r.a, 0), Math.max(Math.abs(-dx * s + dy * c) - r.b, 0));
}
const free = (x, y, infl) => Math.abs(x) <= RX - BODY - 2 && Math.abs(y) <= RY - BODY - 2 && RUBBLE.every((r) => gap(r, x, y) > BODY + infl);
const cellOf = (x, y) => clamp(Math.round((y + RY) / CELL), 0, NY - 1) * NX + clamp(Math.round((x + RX) / CELL), 0, NX - 1);

/** A* over the grid's free cells, 8-connected, from (sx, sy) to (gx, gy); then pulled taut. */
function astar(sx, sy, gx, gy, infl) {
  const N = NX * NY, g = new Float64Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), done = new Uint8Array(N);
  const s = cellOf(sx, sy), t = cellOf(gx, gy), h = (i) => Math.hypot(cx(i) - gx, cy(i) - gy), q = [s];
  g[s] = 0;
  while (q.length) {
    let b = 0;
    for (let k = 1; k < q.length; k++) if (g[q[k]] + h(q[k]) < g[q[b]] + h(q[b])) b = k;
    const i = q.splice(b, 1)[0];
    if (i === t) break;
    if (done[i]++) continue;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = (i % NX) + dx, y = Math.floor(i / NX) + dy, j = y * NX + x;
      if ((!dx && !dy) || x < 0 || y < 0 || x >= NX || y >= NY || done[j] || !free(cx(j), cy(j), infl)) continue;
      const d = g[i] + CELL * Math.hypot(dx, dy);
      if (d < g[j]) { g[j] = d; from[j] = i; q.push(j); }
    }
  }
  if (from[t] < 0 && t !== s) return null;
  const cells = [[gx, gy]];
  for (let i = t; i !== s; i = from[i]) cells.unshift([cx(i), cy(i)]);
  const clear = (a, b, n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.5)) =>
    [...Array(n).keys()].every((k) => !k || free(a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n, infl));
  const pts = [[sx, sy]];
  for (let k = 0, j; k < cells.length; k = j + 1) {
    for (j = cells.length - 1; j > k && !clear(pts[pts.length - 1], cells[j]);) j--;
    pts.push(cells[j]);
  }
  return pts;
}

/** A ring in the rover's frame (u forward, v left), placed at pose (x, y, th). */
const posed = (ring, x, y, th, c = Math.cos(th), s = Math.sin(th)) =>
  ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let infl = value;

  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-RX - 3, -RY, -4], [RX, RY, -4], [RX, -RY, -4], [-RX, RY, -4], [-RX - 3, -RY, WH], [-RX - 3, RY, WH]], 200, 170);
  const P = proj(C), front = facing(C);
  const o = P(0, 0, 0), V = [1, 1, (P(1, 1, 0)[1] - o[1]) / (o[1] - P(0, 0, 1)[1])];
  const dot = (a) => a[0] * V[0] + a[1] * V[1] + a[2] * V[2];
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, a, i, z0, z1); };

  // The floor, the back wall with its doorway, and the guides on the floor are always behind.
  const ground = mk("g", {}, svg);
  put(solid(ground), box(-RX, -RY, RX, RY, 5, 2, -4, 0));
  put(solid(ground), box(-RX - 3, -RY, -RX, -6, 1.2, 0.7, 0, WH));
  put(solid(ground), box(-RX - 3, 14, -RX, RY, 1.2, 0.7, 0, WH));
  const route = mk("path", { class: "dash nf hi" }, ground);
  const goalDot = flatDot(ground, C, 2.4, "dot off");

  const layer = mk("g", {}, svg), rubble = RUBBLE.map((r) => {
    const el = solid(layer), [a, i] = rings(-r.a, -r.b, r.a, r.b, 1.6, 1);
    put(el, prism(P, front, posed(a, r.x, r.y, r.t), posed(i, r.x, r.y, r.t), 0, r.h));
    return { r, el };
  });
  const rover = mk("g", {}, layer);

  // The rover's parts, in its own frame: [ring, crease, z0, z1, centre u, centre z, the part it sits on].
  const part = (u0, v0, u1, v1, r, b, z0, z1, on) => ({ rr: rings(u0, v0, u1, v1, r, b), z0, z1, c: [(u0 + u1) / 2, (v0 + v1) / 2, (z0 + z1) / 2], on, el: solid(rover) });
  const deck = part(-13, -9, 11, 9, 3, 1.2, 3.5, 6.5);
  const mid = part(-10, -6, 7, 6, 2, 1, 6.5, 10.5, deck);
  const top = part(-12, -8, 9, 8, 2.6, 1, 10.5, 12, mid);
  const cam = part(5.5, -2.6, 9, 2.6, 1.2, 0.7, 12, 16, top);
  const disc = (u, R, n) => [circ(R, n), circ(R - 0.9, n)].map((q) => q.map((e) => ({ ...e, u: e.u + u })));
  const lidar = { rr: disc(-4, 4.4, 24), z0: 12, z1: 17, c: [-4, 0, 14.5], on: top, el: solid(rover) };
  const kit = part(14, -5, 22, 5, 1.6, 1, 0.6, 7, null);
  const mag = { rr: disc(18, 2.8, 16), z0: 7, z1: 9, c: [18, 0, 8], on: kit, el: solid(rover) };
  const wheels = [[-8, 1], [8, 1], [-8, -1], [8, -1]].map(([u, side]) => ({ u, side, el: solid(rover) }));
  const arm = solid(rover), prisms = [deck, mid, top, cam, lidar, kit, mag];

  /** A solid along A→B (world points) of radius rd; its crease is the near cap, inset. */
  function tube(a, b, rd, cap) {
    const w = b.map((v, i) => v - a[i]), m = Math.hypot(...w), e1 = [-w[1] / m, w[0] / m, 0];
    const e2 = [e1[1] * w[2] / m, -e1[0] * w[2] / m, (e1[0] * w[1] - e1[1] * w[0]) / m];
    const ring = (O, k) => circ(rd, 16).map((q) => P(...O.map((v, i) => v + (e1[i] * q.u + e2[i] * q.v) * k)));
    const near = dot(w) > 0 ? b : a, hl = hull(ring(a, 1).concat(ring(b, 1)));
    return { sil: poly(fillet(hl, hl.map(() => 1.2))), crease: cap ? poly(ring(near, 0.7)) : "" };
  }

  let last = "";
  function draw(x, y, th, goal) {
    const k = [x, y, th].map((v) => v.toFixed(2)).join() + goal;
    if (k === last) return;
    last = k;
    const c = Math.cos(th), s = Math.sin(th), W = (u, v, z) => [x + u * c - v * s, y + u * s + v * c, z];
    const keys = new Map();
    for (const p of prisms) {
      put(p.el, prism(P, front, posed(p.rr[0], x, y, th), posed(p.rr[1], x, y, th), p.z0, p.z1));
      keys.set(p.el, Math.max(dot(W(...p.c)), p.on ? keys.get(p.on.el) + 0.01 : -Infinity));
    }
    for (const w of wheels) {
      const v = w.side * 11.2;
      put(w.el, tube(W(w.u, v - 2, 4.4), W(w.u, v + 2, 4.4), 4.4, true));
      keys.set(w.el, dot(W(w.u, v, 4.4)) + 0.5);
    }
    put(arm, tube(W(7, 0, 9), W(18, 0, 9), 1.3, false));
    keys.set(arm, Math.max(dot(W(13, 0, 9)), keys.get(mid.el) + 0.01));
    kit.el.sil.classList.toggle("hi", !goal);
    [...keys].sort((a, b) => a[1] - b[1]).forEach(([el], i) => { if (rover.children[i] !== el.g) rover.append(el.g); });
    // Rubble and the rover by the rubble's nearest point to it: their footprints never meet.
    const near = (r) => { const d = gap(r, x, y), m = Math.hypot(x - r.x, y - r.y); return dot([x + ((r.x - x) * (m - d)) / m, y + ((r.y - y) * (m - d)) / m, 0]); };
    const order = rubble.map((q) => [q.el.g, near(q.r)]).concat([[rover, dot([x, y, 0])]]).sort((a, b) => a[1] - b[1]);
    order.forEach(([g], i) => { if (layer.children[i] !== g) layer.append(g); });
  }

  // Softer than the pointer's spring: this is a rover's travel, and a long route should read as driving.
  const sp = { s: spring(0, { k: 30, c: 11, eps: 0.05 }), th: spring(HOME.th, { eps: 0.002 }) };
  let path = [[HOME.x, HOME.y]], len = [0], goal = null, pos = [HOME.x, HOME.y];
  const at = (d) => {
    for (let i = 1; i < path.length; i++) if (d <= len[i] || i === path.length - 1) {
      const f = clamp((d - len[i - 1]) / (len[i] - len[i - 1] || 1), 0, 1), a = path[i - 1], b = path[i];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0])];
    }
    return [...path[0], sp.th.t];
  };

  const B = register(stage, (dt) => {
    let moving = stepS(sp.s, dt);
    const [x, y] = (pos = at(sp.s.x)), L = len[len.length - 1];
    const want = L - sp.s.x >= 3 ? at(sp.s.x + 3)[2] : goal ? null : HOME.th;
    if (want !== null) sp.th.t = sp.th.x + wrap(want - sp.th.x);
    if (stepS(sp.th, dt)) moving = true;
    draw(x, y, sp.th.x, !!goal);
    return moving;
  });
  bag.add(B.unregister);

  function replan() {
    let g = goal ? [clamp(goal[0], -RX, RX), clamp(goal[1], -RY, RY)] : [HOME.x, HOME.y];
    if (!free(g[0], g[1], infl)) {
      let best = -1, bd = Infinity;
      for (let i = 0; i < NX * NY; i++) {
        const d = Math.hypot(cx(i) - g[0], cy(i) - g[1]);
        if (d < bd && free(cx(i), cy(i), infl)) { bd = d; best = i; }
      }
      g = [cx(best), cy(best)];
    }
    const pts = (path = astar(pos[0], pos[1], g[0], g[1], infl) || astar(pos[0], pos[1], g[0], g[1], 0) || [pos]); // no route: stay put
    len = pts.map((q, i) => (i ? Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) : 0));
    for (let i = 1; i < len.length; i++) len[i] += len[i - 1];
    [sp.s.x, sp.s.t] = [0, len[len.length - 1]];
    route.setAttribute("d", goal ? open(pts.map((p) => P(p[0], p[1], 0))) : "");
    place(goalDot, P(g[0], g[1], 0));
    goalDot.setAttribute("class", goal ? "dot" : "dot off");
    const n = (v) => String(Math.round(v)).replace("-", "−");
    read.textContent = goal ? `x ${n(g[0])} · y ${n(g[1])}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const g = unproj(C, p[0], p[1], 0); if (!goal || Math.hypot(g[0] - goal[0], g[1] - goal[1]) >= 1) { goal = g; replan(); } },
    leave: () => { goal = null; replan(); },
  }));
  bag.add(() => svg.replaceChildren());
  replan();

  return { set: (v) => { infl = v; replan(); }, destroy: bag.dispose };
}

hairline({
  name: "rover",
  means: "A rescue rover in a damaged room; point at the floor and it plans a path round the rubble and drives there.",
  rules: [1, 3, 5, 6],
  range: [1, 3.5, 6],
  tour: [[283, 202], [202, 225], [234, 158], null],
  mount,
});
