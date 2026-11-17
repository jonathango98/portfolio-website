/**
 * Rosmaster: the rescue rover on its own, on a round plate, its aid kit set down under the
 * magnet. Point at a part and it goes bright, the corner names it, and it does its job: the
 * LiDAR spins and sweeps a scan, the camera frames a shot on the floor, the mecanum wheels
 * roll, and the magnet charges and lifts the kit. The slider is the tempo of all of it.
 * The pattern: one of many. Picked from the rest pose's outlines, topmost first.
 */
const { Cam, circ, clamp, fillet, fit, hull, mk, open, poly, prism, proj, put, rings, solid,
  spring, stepS, tween, tset, tval, tdone, facing, pointer, register, disposer, rad } = HL;

const TH = rad(120), OFF = -4.5, PLATE = 30, GAP = 2.5; // heading; rover centred; kit's drop below the magnet
const NAMES = { lidar: "lidar", camera: "camera", wheels: "mecanum wheels", arm: "magnet arm", chassis: "chassis" };
const SHOT = [[30, -8, 7], [30, 8, 7], [30, 8, 20], [30, -8, 20]]; // the frame the camera shoots, rover frame

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tempo = value;
  const c = Math.cos(TH), s = Math.sin(TH);
  const W = (u, v, z) => [(u + OFF) * c - v * s, (u + OFF) * s + v * c, z];
  const posed = (ring, du = 0) => ring.map((q) => ({
    u: (q.u + du + OFF) * c - q.v * s, v: (q.u + du + OFF) * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  }));

  const C = Cam(45, 0.5, 5.1);
  const pts = circ(PLATE, 16).map((q) => [q.u, q.v, -3]).concat(SHOT.map((q) => W(...q)), [W(-4, 0, 18), W(22, 0, 11)]);
  fit(C, pts, 200, 162);
  const P = proj(C), front = facing(C);
  const o = P(0, 0, 0), V = [1, 1, (P(1, 1, 0)[1] - o[1]) / (o[1] - P(0, 0, 1)[1])];
  const dot = (a) => a[0] * V[0] + a[1] * V[1] + a[2] * V[2];
  const Pw = (u, v, z) => P(...W(u, v, z));

  const ground = mk("g", {}, svg);
  put(solid(ground), prism(P, front, circ(PLATE, 48), circ(PLATE - 1.6, 48), -3, 0));
  const rover = mk("g", {}, svg), over = mk("g", {}, svg);
  const scan = mk("path", { class: "dash nf" }, over), frust = mk("path", { class: "dash nf" }, over), shot = mk("path", { class: "dash nf" }, over);

  /** A solid along A→B (rover frame) of radius rd, 32 steps round; its crease is the near cap, inset. */
  function tube(a, b, rd, cap) {
    const A = W(...a), B = W(...b), w = B.map((x, i) => x - A[i]), m = Math.hypot(...w);
    const e1 = [-w[1] / m, w[0] / m, 0], e2 = [0, 0, 1];
    const ring = (O, k) => circ(rd, 32).map((q) => P(...O.map((x, i) => x + (e1[i] * q.u + e2[i] * q.v) * k)));
    const near = dot(w) > 0 ? B : A, h = hull(ring(A, 1).concat(ring(B, 1)));
    return { sil: poly(fillet(h, h.map(() => 1.2))), crease: cap ? poly(ring(near, 0.72)) : "", pts: h };
  }
  const box = (u0, v0, u1, v1, r, b, z0, z1) => { const [a, i] = rings(u0, v0, u1, v1, r, b); return [posed(a), posed(i), z0, z1]; };
  const disc = (u, R, z0, z1) => [posed(circ(R, 32), u), posed(circ(R - 0.9, 32), u), z0, z1];

  // Each part: its group, how to draw it (dz lifts it), the point its depth is read at, and what it sits on.
  const parts = [];
  const add = (group, make, at, on) => { const p = { group, make, at, on, el: solid(rover), dz: 0 }; parts.push(p); return p; };
  const flat = (spec) => (dz) => { const [a, i, z0, z1] = spec; const r = prism(P, front, a, i, z0 + dz, z1 + dz); return { ...r, pts: hull(a.map((q) => P(q.u, q.v, z0 + dz)).concat(a.map((q) => P(q.u, q.v, z1 + dz)))) }; };
  const deck = add("chassis", flat(box(-13, -9, 11, 9, 3, 1.2, 3.5, 6.5)), [-1, 0, 5]);
  const mid = add("chassis", flat(box(-10, -6, 7, 6, 2, 1, 6.5, 10.5)), [-1.5, 0, 8.5], deck);
  const top = add("chassis", flat(box(-12, -8, 9, 8, 2.6, 1, 10.5, 12)), [-1.5, 0, 11.2], mid);
  const cam = add("camera", flat(box(5, -2.8, 8.6, 2.8, 1.2, 0.7, 12, 15.4)), [6.8, 0, 13.7], top);
  const lens = add("camera", () => tube([8.6, 0, 13.7], [10.2, 0, 13.7], 1.4, true), [9.6, 0, 13.7], cam);
  const base = add("lidar", flat(disc(-4, 4.6, 12, 13.6)), [-4, 0, 12.8], top);
  const head = add("lidar", flat(disc(-4, 3.9, 13.6, 17.6)), [-4, 0, 15.6], base);
  const kit = add("arm", flat(box(14, -5, 22, 5, 1.6, 1, 0, 9 - GAP)), [18, 0, 3.2]);
  const mag = add("arm", flat(disc(18, 2.8, 9, 11)), [18, 0, 10], kit);
  const arm = add("arm", () => tube([7, 0, 10], [18, 0, 10], 1.3, false), [13, 0, 10], mag);
  const wheels = [[-8, 1], [8, 1], [-8, -1], [8, -1]].map(([u, side]) =>
    add("wheels", () => tube([u, side * 9.2, 4.4], [u, side * 13.2, 4.4], 4.4, true), [u, side * 11.2, 4.4]));
  const rollers = wheels.map((w) => mk("path", { class: "lo nf" }, w.el.g));
  const notch = mk("path", { class: "lo nf" }, head.el.g);

  // Paint order is fixed: the rover never moves, and nothing lifts past what it sits on.
  const key = new Map();
  for (const p of parts) key.set(p, Math.max(dot(W(...p.at)) + (p.group === "wheels" ? 0.5 : 0), p.on ? key.get(p.on) + 0.01 : -Infinity));
  const charge = mk("g", { class: "nf" }, rover);
  [...parts].sort((a, b) => key.get(a) - key.get(b)).forEach((p) => { rover.append(p.el.g); if (p === kit) rover.append(charge); });
  const ringEls = [0, 1, 2].map(() => mk("path", { class: "dash nf" }, charge));
  for (const p of parts) { const r = p.make(0); put(p.el, r); p.hit = r.pts; }

  const inside = (h, x, y) => h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) >= 0; })
    || h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) <= 0; });
  const topmost = [...parts].sort((a, b) => key.get(b) - key.get(a));

  // Rollers sit at 45° across each tyre, on the half that faces the viewer.
  function drawRollers(a) {
    wheels.forEach((w, n) => {
      const [u, side] = [[-8, 1], [8, 1], [-8, -1], [8, -1]][n];
      let d = "";
      for (let k = 0; k < 10; k++) {
        const p0 = a + (k * Math.PI) / 5, p1 = p0 + 0.45;
        const at = (ph, v) => W(u + Math.cos(ph) * 4.4, v, 4.4 + Math.sin(ph) * 4.4);
        if (dot(W(Math.cos(p0 + 0.22), 0, Math.sin(p0 + 0.22)).map((x, i) => x - W(0, 0, 0)[i])) < 0.2) continue;
        d += open([P(...at(p0, side * 9.6)), P(...at(p1, side * 12.8))]);
      }
      rollers[n].setAttribute("d", d);
    });
  }

  const sp = { lidar: spring(0, { eps: 0.01 }), wheels: spring(0, { eps: 0.01 }) }, ang = { lidar: 0, wheels: 0, ring: 0 };
  const tw = { camera: tween(0), arm: tween(0) };
  let chosen = null;
  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const k of ["lidar", "wheels"]) {
      sp[k].t = chosen === k ? tempo : 0;
      if (stepS(sp[k], dt)) moving = true;
      if (Math.abs(sp[k].x) > 0.003) { ang[k] += dt * sp[k].x * (k === "lidar" ? 5 : 3.5); moving = true; }
    }
    const a = ang.lidar, hc = W(-4, 0, 17.6), tip = (r) => [hc[0] + Math.cos(a + TH) * r, hc[1] + Math.sin(a + TH) * r];
    notch.setAttribute("d", open([P(...hc), P(...tip(3.2), 17.6)]));
    scan.setAttribute("d", chosen === "lidar" ? open([P(...tip(4.4), 15.6), P(...tip(PLATE - 2), 15.6)]) : "");
    drawRollers(-ang.wheels);

    const t = tval(tw.camera, now), L = W(10.2, 0, 13.7);
    frust.setAttribute("d", t > 0.01 ? SHOT.map((q) => open([P(...L), P(...W(...q).map((x, i) => L[i] + (x - L[i]) * t))])).join("") : "");
    shot.setAttribute("d", t > 0.98 ? poly(SHOT.map((q) => Pw(...q))) : "");

    const lift = tval(tw.arm, now);
    if (Math.abs(lift - kit.dz) > 0.001) { kit.dz = lift; put(kit.el, kit.make(lift * GAP)); }
    const charging = chosen === "arm" && lift < 0.99;
    if (charging || chosen === "arm") ang.ring = (ang.ring + dt * tempo * 1.4) % 1;
    ringEls.forEach((el, k) => {
      const f = (ang.ring + k / 3) % 1, r = 5.5 - 2.7 * f, z = 9 - GAP * (1 - lift) / 2;
      el.setAttribute("d", chosen === "arm" ? poly(circ(r, 32).map((q) => Pw(18 + q.u, q.v, z))) : "");
    });
    if (chosen === "arm") moving = true;
    return moving || !tdone(tw.camera, now) || !tdone(tw.arm, now);
  });
  bag.add(B.unregister);

  function choose(g) {
    if (g === chosen) return;
    chosen = g;
    for (const p of parts) p.el.sil.classList.toggle("hi", g ? p.group === g : p.group === "lidar");
    notch.setAttribute("class", chosen === "lidar" ? "hi nf" : "lo nf");
    for (const r of rollers) r.setAttribute("class", chosen === "wheels" ? "hi nf" : "lo nf");
    const now = performance.now();
    tset(tw.camera, g === "camera" ? 1 : 0, now, 0);
    tset(tw.arm, g === "arm" ? 1 : 0, now, g === "arm" ? 700 / tempo : 0); // charge first, then lift
    read.textContent = g ? NAMES[g] : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => choose(topmost.find((q) => inside(q.hit, p[0], p[1]))?.group ?? null),
    leave: () => choose(null),
  }));
  bag.add(() => svg.replaceChildren());
  chosen = undefined;
  choose(null);

  return { set: (v) => { tempo = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rosmaster",
  means: "The rescue rover, part by part: point at one and it goes bright, is named, and does its job.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1.6],
  tour: [[242, 79], [189, 96], [198, 154], [133, 143], null],
  mount,
});
