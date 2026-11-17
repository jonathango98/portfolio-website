/**
 * TriFinger: three fingers hang from a hub under a three-legged frame, over a round arena
 * with a cube on it. Each finger has three joints: a shoulder that tilts its
 * plane sideways, then a hip and a knee in that plane, solved by inverse
 * kinematics. The pointer sets a point on the arena floor and the three tips
 * reach for it together; over the cube they pinch it, lifting clear of it
 * before they travel. At rest they hold the cube. The slider is the reach, in
 * rig units from the arena's centre.
 *
 * The pattern: a field of one point. Springs on the tips' target, a hit test
 * on the floor plane (which never moves), joints solved from the springs.
 */
const {
  Cam, circ, clamp, fillet, fit, hull, mk, poly, prism, proj, put, rad, rings, rrect, solid,
  spring, stepS, facing, pointer, register, disposer, unproj,
} = HL;

const A = rad(-30), LX = [Math.cos(A), Math.sin(A)], FX = [-Math.sin(A), Math.cos(A)];
const W = (p) => [p[0] * LX[0] + p[1] * FX[0], p[0] * LX[1] + p[1] * FX[1], p[2]];
const rot = (ring) => ring.map((q) => ({
  u: q.u * LX[0] + q.v * FX[0], v: q.u * LX[1] + q.v * FX[1],
  nu: q.nu * LX[0] + q.nv * FX[0], nv: q.nu * LX[1] + q.nv * FX[1],
}));
const add = (a, b, s = 1) => a.map((v, i) => v + b[i] * s);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const m = Math.hypot(...a); return a.map((v) => v / m); };

// Rig units: x along the frame, y across it, z up. The hub hangs at HZ; L1 and L2 are a finger's links.
const HZ = 76, MR = 9, L1 = 42, L2 = 46, FLOOR = 2, TIP = 2.6, ARENA = 40, BASE = 66, POST = 58;
const CUBE = [-8, 6], CH = 12, PAD = 16; // the cube's centre and edge; the pinch zone round it
const PINCH = { x: CUBE[0], y: CUBE[1], z: FLOOR + CH / 2, s: CH / 2 + TIP };
const CLEAR = FLOOR + CH + TIP + 3, REACH_Z = FLOOR + TIP + 0.5, REACH_S = 4.6;
// One finger faces away, a little off-centre, so the two in front pinch the cube where it can be seen.
// Each finger hangs under its own leg's beam.
const FACE = Math.atan2(FX[0] + FX[1], LX[0] + LX[1]) + Math.PI + rad(10);
const FR = [0, 1, 2].map((i) => { const a = FACE + rad(120 * i); return [Math.cos(a), Math.sin(a), 0]; });

/** Finger i's joints with its tip at T: mount M, shoulder axis r, knee axis n, knee E, tip T. */
function finger(i, T) {
  const r = FR[i], t = [-r[1], r[0], 0], M = [r[0] * MR, r[1] * MR, HZ], D = add(T, M, -1);
  const tilt = Math.atan2(dot(D, t), -D[2]), d = add([0, 0, -Math.cos(tilt)], t, Math.sin(tilt));
  const u = dot(D, r), w = dot(D, d), c = clamp(Math.hypot(u, w), Math.abs(L1 - L2) + 1, L1 + L2 - 1);
  const phi = Math.atan2(w, u), th = phi - Math.acos((L1 * L1 + c * c - L2 * L2) / (2 * L1 * c)); // knee out
  const at = (a, l) => add(add(M, r, l * Math.cos(a)), d, l * Math.sin(a));
  return { M, r, n: unit(cross(r, d)), E: at(th, L1), T: at(phi, c) };
}
const tips = (g) => FR.map((r) => [g.x + r[0] * g.s, g.y + r[1] * g.s, g.z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;

  // Fit to the frame and to every finger at the far end of the slider's reach.
  const C = Cam(45, 0.5, 1.62), pts = [];
  for (let k = 0; k < 8; k++) pts.push([BASE * Math.cos((k * Math.PI) / 4), BASE * Math.sin((k * Math.PI) / 4), -5]);
  for (const r of FR) pts.push([r[0] * POST, r[1] * POST, 102]);
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4, g = { x: 36 * Math.cos(a), y: 36 * Math.sin(a), z: REACH_Z, s: REACH_S };
    tips(g).forEach((T, i) => { const f = finger(i, T); pts.push(f.E, f.T); });
  }
  fit(C, pts.map(W), 200, 166);
  const P = proj(C), front = facing(C), Pl = (p) => P(...W(p));
  const o = P(0, 0, 0), dx = P(1, 1, 0)[1] - o[1], dz = o[1] - P(0, 0, 1)[1];
  const V = [LX[0] + LX[1], FX[0] + FX[1], dx / dz]; // toward the viewer, in rig units

  const box = (l0, f0, l1, f1, r, b, z0, z1) => {
    const [a, i] = rings(l0, f0, l1, f1, r, b);
    return prism(P, front, rot(a), rot(i), z0, z1);
  };
  /** A solid along A→B with cross-section sec; its crease is the near cap, inset. */
  function tube(a, b, sec, cap) {
    const w = unit(add(b, a, -1)), e1 = unit(cross(w, Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), e2 = cross(w, e1);
    const ring = (O, k) => sec.map((q) => Pl(add(add(O, e1, q.u * k), e2, q.v * k)));
    const near = dot(w, V) > 0 ? b : a;
    const h = hull(ring(a, 1).concat(ring(b, 1)));
    return { sil: poly(fillet(h, h.map(() => 1.2))), crease: cap ? poly(ring(near, 0.72)) : "" };
  }

  // The plate and the arena are always behind; everything else is painted by depth.
  const ground = mk("g", {}, svg), layer = mk("g", {}, svg), parts = [];
  put(solid(ground), prism(P, front, circ(BASE, 64), circ(BASE - 2, 64), -5, 0));
  put(solid(ground), prism(P, front, circ(ARENA, 48), circ(ARENA - 1.6, 48), 0, FLOOR));
  const fixed = (paths, at) => { const p = { el: solid(layer), key: dot(at, V) }; put(p.el, paths); parts.push(p); return p; };
  for (const r of FR) {
    const x = r[0] * POST, y = r[1] * POST, end = [r[0] * (POST - 3.5), r[1] * (POST - 3.5), 88];
    fixed(box(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 1.4, 0.8, 0, 102), [x, y, 30]);
    fixed(tube([0, 0, 88], end, rrect(-4, -6, 4, 6, 1.6, 2), true), [r[0] * 27, r[1] * 27, 88]);
  }
  fixed(prism(P, front, circ(11, 24), circ(9.6, 24), HZ - 2, 82), [0, 0, HZ]);
  const cube = fixed(box(CUBE[0] - CH / 2, CUBE[1] - CH / 2, CUBE[0] + CH / 2, CUBE[1] + CH / 2, 2.2, 1, FLOOR, FLOOR + CH), [...CUBE, FLOOR + CH / 2]);

  const round = (r) => circ(r, 16);
  const fingers = FR.map(() => {
    const part = () => { const p = { el: solid(layer), key: 0 }; parts.push(p); return p; };
    return { sh: part(), up: part(), kn: part(), lo: part(), tp: part() };
  });
  const h = (p, a, b, sec, cap, at, bias = 0) => { put(p.el, tube(a, b, sec, cap)); p.key = dot(at, V) + bias; };
  let last = "";
  function draw(g, bright) {
    const k = [g.x, g.y, g.z, g.s].map((v) => v.toFixed(2)).join() + bright;
    if (k === last) return;
    last = k;
    tips(g).forEach((T, i) => {
      const f = finger(i, T), F = fingers[i], T0 = add(f.T, unit(add(f.T, f.E, -1)), -5);
      h(F.sh, add(f.M, f.r, -4), add(f.M, f.r, 4), round(4.2), true, f.M, 1);
      h(F.up, f.M, f.E, round(2.6), false, add(f.M, f.E), 0);
      F.up.key /= 2;
      h(F.kn, add(f.E, f.n, -4), add(f.E, f.n, 4), round(3.6), true, f.E, 2);
      h(F.lo, f.E, T0, round(2.2), false, T0, 0.5);
      h(F.tp, T0, f.T, round(TIP), true, f.T, 1);
      F.tp.el.sil.classList.toggle("hi", bright);
    });
    cube.el.sil.classList.toggle("hi", !bright);
    const ps = parts.slice().sort((a, b) => a.key - b.key);
    if (ps.some((p, i) => layer.children[i] !== p.el.g)) ps.forEach((p) => layer.append(p.el.g));
  }

  const sp = {}, goal = { ...PINCH };
  for (const k of "xyzs") sp[k] = spring(PINCH[k], { eps: 0.05 });
  let pinch = true;
  const nearCube = (x, y) => Math.hypot(x - CUBE[0], y - CUBE[1]) < PAD;

  const B = register(stage, (dt) => {
    // Lift clear of the cube before travelling to or from it; travel; then come down.
    const far = Math.hypot(sp.x.x - goal.x, sp.y.x - goal.y) > 6;
    const lift = far && (pinch || nearCube(sp.x.x, sp.y.x));
    sp.z.t = lift ? CLEAR : goal.z;
    const go = !lift || sp.z.x > CLEAR - 2;
    sp.x.t = go ? goal.x : sp.x.x;
    sp.y.t = go ? goal.y : sp.y.x;
    sp.s.t = goal.s;
    let moving = false;
    for (const k of "xyzs") if (stepS(sp[k], dt)) moving = true;
    draw({ x: sp.x.x, y: sp.y.x, z: sp.z.x, s: sp.s.x }, !pinch);
    return moving || Math.hypot(sp.x.x - goal.x, sp.y.x - goal.y, sp.z.x - goal.z) > 0.2;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    pinch = !over || nearCube(...over);
    if (pinch) Object.assign(goal, PINCH);
    else {
      const m = Math.hypot(...over), s = m > R ? R / m : 1;
      Object.assign(goal, { x: over[0] * s, y: over[1] * s, z: REACH_Z, s: REACH_S });
    }
    const n = (v) => String(Math.round(v)).replace("-", "−");
    read.textContent = !over ? "rest" : pinch ? "cube" : `x ${n(goal.x)} · y ${n(goal.y)}`;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const g = unproj(C, p[0], p[1], FLOOR);
      over = [g[0] * LX[0] + g[1] * LX[1], g[0] * FX[0] + g[1] * FX[1]];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "trifinger",
  means: "Three fingers hang from a three-legged frame; point at the floor and all three tips reach for it, or pinch the cube.",
  rules: [1, 3, 5, 9],
  range: [22, 30, 36],
  tour: [[243, 223], [173, 210], [185, 232], null],
  mount,
});
