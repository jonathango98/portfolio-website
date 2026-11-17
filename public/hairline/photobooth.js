/**
 * Photobooth: a landscape iPad on a tripod, and a three-photo strip standing
 * beside it, full from the last session. A click starts a shot: the strip
 * clears if it is full, the dots on the screen count down, and the shot
 * leaves the screen as a square print of the guest, shrinks, and lands in the
 * next window. Three clicks fill the strip. The slider is the countdown, in
 * beats, one dot each.
 *
 * The pattern: a click runs a short sequence, like FOD's test. The count is
 * timed inside the frame loop; each print flies on the 700ms tween. The bright
 * edge is the screen while it counts, then the newest print.
 */
const {
  Cam, EASE_LIFT, circ, clamp, fillet, fit, lerp, mk, place, poly, open, prism, proj, facing, put, rings,
  rrect, solid, tdone, tset, tval, tween, pointer, register, disposer,
} = HL;

const T = 3, IY = 44, IZ0 = 50, IZ1 = 116, BZ = 5, HX = -2, HZ = 40, FR = 30, BEAT = 700;
const SX0 = 1.5, SX1 = 3.5, SY0 = 70, SY1 = 104, SZ0 = 4, SZ1 = 106;
const WS = 26, WIN = [76, 47, 18], PX = 5.5;
const SC = [0, (IZ0 + IZ1) / 2], SS = IZ1 - IZ0 - 2 * BZ, WY = (SY0 + SY1) / 2;
// The tripod's feet, far to near.
const FEET = [270, 150, 30].map((a) => [HX + FR * Math.cos((a * Math.PI) / 180), FR * Math.sin((a * Math.PI) / 180)]);

/** A plate standing in the plane x, as screen points: a rounded rectangle in (y, z). */
const vplate = (P, x, y0, z0, y1, z1, r) => rrect(y0, z0, y1, z1, r, 4).map((q) => P(x, q.u, q.v));

/** A ring moved to (cx, cy). */
const moved = (ring, cx, cy) => ring.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

/** A leg from a to b on screen, tapering from width w0 to w1, with rounded ends. */
function leg(a, b, w0, w1) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const pts = [[a[0] + nx * w0, a[1] + ny * w0], [b[0] + nx * w1, b[1] + ny * w1], [b[0] - nx * w1, b[1] - ny * w1], [a[0] - nx * w0, a[1] - ny * w0]];
  return poly(fillet(pts, [w0 * 0.9, w1 * 0.9, w1 * 0.9, w0 * 0.9]));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let n = Math.round(value);

  const C = Cam(45, 0.5, 1.56);
  fit(C, [...FEET.map(([x, y]) => [x, y, 0]), [0, -IY, IZ1], [T, IY, IZ0], [SX1, SY1, 0], [SX0, SY0, SZ1], [10, SY1, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The tripod: three legs, then the column and the collar they meet in.
  const hub = P(HX, 0, HZ);
  const drawLeg = ([x, y]) => {
    mk("path", { d: leg(hub, P(x, y, 1.5), 1.5, 1.1), class: "sil" }, g);
    put(solid(g), prism(P, front, moved(circ(2.2, 12), x, y), moved(circ(1.6, 12), x, y), 0, 1.5));
  };
  FEET.forEach(drawLeg);
  put(solid(g), prism(P, front, moved(circ(1.8, 12), HX, 0), moved(circ(1.2, 12), HX, 0), HZ, SC[1]));
  put(solid(g), prism(P, front, moved(circ(3.6, 16), HX, 0), moved(circ(2.8, 16), HX, 0), HZ - 4, HZ + 2));

  // The iPad, in landscape, its camera on the long edge.
  mk("path", { d: poly(vplate(P, 0, -IY, IZ0, IY, IZ1, 6)), class: "lo" }, g);
  mk("path", { d: poly(vplate(P, T, -IY, IZ0, IY, IZ1, 6)), class: "sil" }, g);
  const screen = mk("path", { d: poly(vplate(P, T, -IY + BZ, IZ0 + BZ, IY - BZ, IZ1 - BZ, 2.4)), class: "nf lo" }, g);
  place(mk("circle", { r: 1.1, class: "dot m" }, g), P(T, 0, IZ1 - BZ / 2));
  const dg = mk("g", {}, g);
  let dots = [];
  function makeDots() {
    dots.forEach((d) => d.remove());
    dots = [];
    for (let i = 0; i < n; i++) {
      const d = mk("circle", { r: 1.7, class: "dot m" }, dg);
      place(d, P(T, (i - (n - 1) / 2) * 8, SC[1]));
      dots.push(d);
    }
  }
  const light = (lit) => dots.forEach((d, i) => d.setAttribute("class", lit < 0 ? "dot m" : i < lit ? "dot" : "dot off"));

  // The strip, on its foot: three square windows and a blank band at the bottom.
  const [fr, fi] = rings(-5, SY0 + 2, 10, SY1 - 2, 3, 1);
  put(solid(g), prism(P, front, fr, fi, 0, SZ0));
  mk("path", { d: poly(vplate(P, SX0, SY0, SZ0, SY1, SZ1, 2.5)), class: "lo" }, g);
  mk("path", { d: poly(vplate(P, SX1, SY0, SZ0, SY1, SZ1, 2.5)), class: "sil" }, g);
  for (const z of WIN) mk("path", { d: poly(vplate(P, SX1, WY - WS / 2, z, WY + WS / 2, z + WS, 1.2)), class: "nf dash" }, g);

  // The prints: square, the guest's head and shoulders inside. They start full, the last session's strip.
  const prints = WIN.map(() => ({
    back: mk("path", { class: "lo" }, g),
    face: mk("path", { class: "sil" }, g),
    head: mk("path", { class: "nf lo" }, g),
    body: mk("path", { class: "nf lo" }, g),
    tw: tween(1), shown: true, last: NaN,
  }));
  function drawPrint(pr, j, t) {
    if (t === pr.last) return;
    pr.last = t;
    if (!pr.shown) { [pr.back, pr.face, pr.head, pr.body].forEach((e) => e.setAttribute("d", "")); return; }
    const e = EASE_LIFT(t), y = lerp(SC[0], WY, e), z = lerp(SC[1], WIN[j] + WS / 2, e);
    const s = lerp(SS, WS, e), h = s / 2, r = lerp(2.4, 1.2, e), b = s * 0.08;
    const on = (pts) => pts.map(([u, v]) => P(PX, y + u, z + v));
    pr.back.setAttribute("d", poly(vplate(P, PX - 0.8, y - h, z - h, y + h, z + h, r)));
    pr.face.setAttribute("d", poly(vplate(P, PX, y - h, z - h, y + h, z + h, r)));
    pr.head.setAttribute("d", poly(on(circ(s * 0.15, 20).map((q) => [q.u, q.v + s * 0.1]))));
    const arc = [];
    for (let i = 0; i <= 16; i++) { const a = (Math.PI * i) / 16; arc.push([-s * 0.3 * Math.cos(a), -h + b + s * 0.3 * Math.sin(a)]); }
    pr.body.setAttribute("d", open(on(arc)));
  }

  // The session: phase 0 idle, 1 counting, 2 a print in flight. shots is how many windows are full.
  let phase = 0, shots = 3, t0 = 0, left = true;
  const mark = (k) => { screen.classList.toggle("hi", k < 0); prints.forEach((pr, j) => pr.face.classList.toggle("hi", j === k)); };

  const B = register(stage, (_dt, now) => {
    if (phase === 1) {
      const lit = n - Math.floor((now - t0) / BEAT);
      light(lit);
      if (lit <= 0) {
        phase = 2;
        prints[shots].shown = true;
        tset(prints[shots].tw, 1, now, 0);
        mark(shots);
        if (!left) read.textContent = `shot ${shots + 1}/3`;
      } else if (!left) read.textContent = String(lit);
    }
    if (phase === 2 && tdone(prints[shots].tw, now)) { shots++; phase = 0; light(-1); }
    let moving = phase > 0;
    prints.forEach((pr, j) => { drawPrint(pr, j, tval(pr.tw, now)); if (!tdone(pr.tw, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  /** One click, one shot: a full strip clears first. */
  function click() {
    left = false;
    if (phase) return;
    if (shots === 3) {
      shots = 0;
      prints.forEach((pr) => { pr.shown = false; pr.tw = tween(0); pr.last = NaN; });
    }
    phase = 1; t0 = performance.now();
    mark(-1);
    light(n);
    read.textContent = String(n);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: () => { left = false; if (!phase) read.textContent = "tap"; },
    down: click,
    leave: () => { left = true; read.textContent = "rest"; },
  }));
  bag.add(() => svg.replaceChildren());

  makeDots();
  mark(2);

  return {
    set: (v) => { n = clamp(Math.round(v), 1, 5); makeDots(); if (!phase) light(-1); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "photobooth",
  means: "A landscape iPad on a tripod beside a photo strip; a click counts down three and drops one square print into the strip.",
  rules: [4, 5, 8, 10],
  range: [1, 3, 5],
  tour: [[236, 113], [137, 180], null],
  mount,
});
