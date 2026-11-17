/**
 * GELLO: a bimanual teleoperation rig. Two UR arms stand on a pedestal, their
 * bases tilted 45° outward into a V. In front, on a cart, two GELLO leaders,
 * small replicas on the same V, wait for a hand. Press on a leader to grab it
 * and drag: across swings its base, down the screen reaches it forward. Let go
 * and it stays put. Each follower reads its leader's joints through a second
 * spring, so it copies a beat behind. The slider is the swing's limit, in degrees.
 *
 * The pattern: grab and drag. Springs for the hand, a spring chained behind it
 * for the follower, a grab test on each leader's rest pose, and one bright
 * edge: the handle of the leader under or in the hand.
 */
const {
  Cam, circ, clamp, fillet, fit, hull, lerp, mk, poly, prism, proj, put, rad, rings, rrect, solid,
  spring, stepS, facing, pointer, register, disposer,
} = HL;

const A = rad(-34), LX = [Math.cos(A), Math.sin(A)], FX = [-Math.sin(A), Math.cos(A)];
const W = (p) => [p[0] * LX[0] + p[1] * FX[0], p[0] * LX[1] + p[1] * FX[1], p[2]];
const rot = (ring) => ring.map((q) => ({
  u: q.u * LX[0] + q.v * FX[0], v: q.u * LX[1] + q.v * FX[1],
  nu: q.nu * LX[0] + q.nv * FX[0], nv: q.nu * LX[1] + q.nv * FX[1],
}));
const add = (a, b, s = 1) => a.map((v, i) => v + b[i] * s);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const m = Math.hypot(...a); return a.map((v) => v / m); };

// One UR's links, in rig units; a GELLO is the same chain at scale G.
const H0 = 10, A1 = 46, A2 = 40, A3 = 8, G = 0.6, C45 = Math.SQRT1_2;
// [half spread, depth, height, centre]: the cart stands ahead of the pedestal.
const GX = 0, MOUNT = { ur: [9, -43, 100, 0], gello: [5, 50, 44, GX] };
// Joints [swing, shoulder, elbow, wrist] in degrees. Swing 0 points the arm straight ahead,
// positive turns it in; shoulder 0 is along the base. Reach 0 is folded, 1 is out.
const pose = (sw, r) => { const sh = lerp(20, 62, r), el = lerp(112, 58, r); return [sw, sh, el, 168 - sh - el]; };
const REST_AT = { "-1": [10, 0.15], 1: [-10, 0.45] }; // [swing, reach]
const REST = { "-1": pose(...REST_AT[-1]), 1: pose(...REST_AT[1]) };

/** The joints of one chain: side -1 or 1, q in degrees, s its scale, M its mount. */
function fk(side, q, s, M) {
  const n = [side * C45, 0, C45], e2 = cross(n, [0, 1, 0]), y = rad(q[0] * side);
  const d = add([0, Math.cos(y), 0], e2, Math.sin(y)), ax = unit(cross(n, d));
  const dir = (a) => add(n.map((v) => v * Math.cos(rad(a))), d, Math.sin(rad(a)));
  const m = [M[3] + side * M[0], M[1], M[2]], S = add(m, n, H0 * s), E = add(S, dir(q[1]), A1 * s);
  const Wr = add(E, dir(q[1] + q[2]), A2 * s), T = add(Wr, dir(q[1] + q[2] + q[3]), A3 * s);
  return { m, n, ax, S, E, Wr, T, u3: dir(q[1] + q[2] + q[3]) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;

  // Fit to every pose the slider's far end allows, and the pedestal and cart.
  const C = Cam(45, 0.5, 1.5), pts = [];
  for (const sd of [-1, 1]) for (const [k, M] of [[1, MOUNT.ur], [G, MOUNT.gello]]) for (const sw of [-50, 0, 50]) for (const r of [0, 1]) {
    const f = fk(sd, pose(sw, r), k, M);
    pts.push(f.S, f.E, f.Wr, f.T);
  }
  for (const c of [[-26, -60, 0], [26, -26, 0], [GX - 32, 34, 0], [GX + 32, 66, 0], [-26, -26, 0], [GX + 32, 34, 0], [GX - 32, 66, 0]]) pts.push(c);
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

  const back = mk("g", {}, svg), fore = mk("g", {}, svg);
  put(solid(back), box(-26, -60, 26, -26, 6, 1.6, 0, 4));
  put(solid(back), box(-9, -52, 9, -34, 4, 1.4, 4, 100));
  put(solid(fore), box(GX - 32, 34, GX + 32, 66, 6, 1.8, 0, 22));
  put(solid(fore), box(GX - 6, 44, GX + 6, 56, 2.5, 1, 22, 44));

  const round = (r) => circ(r, 20), square = (r) => rrect(-r, -r * 0.75, r, r * 0.75, r * 0.3, 2);
  /** One arm's parts, each a solid with a depth key, redrawn from its joints. */
  function arm(layer, sd, gello) {
    const s = gello ? G : 1, M = gello ? MOUNT.gello : MOUNT.ur, J = gello ? square : round;
    const parts = [], part = () => { const p = { el: solid(layer), key: 0 }; parts.push(p); return p; };
    const base = part(), sj = part(), up = part(), ej = part(), fo = part(), wj = part(), wl = part(), f1 = part(), f2 = part();
    let last = "";
    function draw(q) {
      const k = q.map((v) => v.toFixed(2)).join();
      if (k === last) return false;
      last = k;
      const f = fk(sd, q, s, M), h = (p, a, b, sec, cap, bias = 0) => {
        put(p.el, tube(a, b, sec, cap));
        p.key = dot(add(a, b), V) / 2 + bias;
      };
      const jl = gello ? 4.4 : 8;
      h(base, add(f.m, f.n, -2 * s), add(f.m, f.n, H0 * s * 0.7), round(gello ? 5 : 8), true);
      h(sj, add(f.S, f.ax, -jl * s), add(f.S, f.ax, jl * s), J(gello ? 5.6 : 6.6), true, 6);
      h(up, f.S, f.E, gello ? square(2.2) : round(3.8), false);
      h(ej, add(f.E, f.ax, -jl * s * 0.85), add(f.E, f.ax, jl * s * 0.85), J(gello ? 5 : 5.6), true, 5);
      h(fo, f.E, f.Wr, gello ? square(2) : round(3.1), false);
      h(wj, add(f.Wr, f.ax, -jl * s * 0.7), add(f.Wr, f.ax, jl * s * 0.7), J(gello ? 4.2 : 4.6), true, 4);
      h(wl, f.Wr, f.T, round(gello ? 1.8 : 3.4), true, 2);
      if (gello) {
        h(f1, f.T, add(f.T, f.u3, 9), round(1.6), true, 3);
        h(f2, add(f.T, f.ax, 1.6), add(add(f.T, f.ax, 3.6), f.u3, 2), round(0.9), false, 1);
      } else {
        h(f1, add(f.T, f.ax, -2.6), add(add(f.T, f.ax, -2.6), f.u3, 8), round(1.3), false, 3);
        h(f2, add(f.T, f.ax, 2.6), add(add(f.T, f.ax, 2.6), f.u3, 8), round(1.3), false, 3);
      }
      return true;
    }
    return { parts, draw, grip: gello ? f1 : null };
  }

  const ur = { "-1": arm(back, -1, false), 1: arm(back, 1, false) };
  const gl = { "-1": arm(fore, -1, true), 1: arm(fore, 1, true) };
  const lead = {}, fol = {};
  for (const sd of ["-1", "1"]) {
    lead[sd] = REST[sd].map((v) => spring(v, { eps: 0.05 }));
    fol[sd] = REST[sd].map((v) => spring(v, { eps: 0.05 }));
  }
  const bright = (sd) => { for (const k of ["-1", "1"]) gl[k].grip.el.sil.classList.toggle("hi", +k === sd); };
  bright(-1);

  /** Paint each layer back to front; move the groups only when their order changed. */
  function order(layer, arms) {
    const ps = arms.flatMap((a) => a.parts).sort((a, b) => a.key - b.key);
    if (ps.some((p, i) => layer.children[i + layer.childElementCount - ps.length] !== p.el.g)) ps.forEach((p) => layer.append(p.el.g));
  }

  const B = register(stage, (dt) => {
    let moving = false, drew = false;
    for (const sd of ["-1", "1"]) {
      lead[sd].forEach((sp, i) => { if (stepS(sp, dt)) moving = true; fol[sd][i].t = sp.x; if (stepS(fol[sd][i], dt)) moving = true; });
      if (gl[sd].draw(lead[sd].map((sp) => sp.x))) drew = true;
      if (ur[sd].draw(fol[sd].map((sp) => sp.x))) drew = true;
    }
    if (drew) { order(back, [ur["-1"], ur[1]]); order(fore, [gl["-1"], gl[1]]); }
    return moving;
  });
  bag.add(B.unregister);

  // Grabbing tests each GELLO's rest pose, never the moving one: its screen box, padded.
  const boxes = {}, cx = Pl([GX, 50, 44])[0];
  for (const sd of [-1, 1]) {
    const f = fk(sd, REST[sd], G, MOUNT.gello), q = [f.S, f.E, f.Wr, f.T].map(Pl), xs = q.map((v) => v[0]), ys = q.map((v) => v[1]);
    boxes[sd] = [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8];
  }
  const inBox = (sd, p) => { const b = boxes[sd]; return p[0] > b[0] && p[0] < b[2] && p[1] > b[1] && p[1] < b[3]; };
  const over = (p) => (inBox(-1, p) && inBox(1, p) ? (p[0] < cx ? -1 : 1) : inBox(-1, p) ? -1 : inBox(1, p) ? 1 : 0);
  const name = (sd) => (sd < 0 ? "left" : "right");

  // A drag of D viewBox units spans the whole reach, or the whole swing either way.
  const D = 60, cur = { "-1": REST_AT[-1].slice(), 1: REST_AT[1].slice() };
  let held = 0, p0 = null, at0 = null;
  function move(p, e) {
    const pressed = e.pointerType === "ghost" || (e.buttons & 1) === 1;
    if (held && !pressed) held = 0; // let go: the leader stays where it was put
    if (!held && pressed && (held = over(p))) { p0 = p; at0 = cur[held].slice(); }
    if (held) {
      // Outward is negative swing; down the screen is forward, so more reach.
      cur[held] = [clamp(at0[0] - (held * (p[0] - p0[0]) / D) * swing, -swing, swing), clamp(at0[1] + (p[1] - p0[1]) / D, 0, 1)];
      pose(...cur[held]).forEach((v, i) => (lead[held][i].t = v));
      read.textContent = `${name(held)} ${Math.round(cur[held][0])}°`;
    } else if (over(p)) read.textContent = name(over(p));
    bright(held || over(p) || -1);
    B.wake();
  }
  function leave() {
    held = 0;
    for (const sd of ["-1", "1"]) { cur[sd] = REST_AT[sd].slice(); lead[sd].forEach((sp, i) => (sp.t = REST[sd][i])); }
    bright(-1);
    read.textContent = "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { swing = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gello",
  means: "Two small GELLO leaders drive two UR arms mounted in a V; grab a leader and drag it, and its arm copies a beat behind.",
  rules: [1, 3, 5, 8],
  range: [15, 30, 50],
  tour: [[167, 241], [140, 272], null, [215, 215], [248, 250], null],
  mount,
});
