/**
 * FOD: a foreign-object test, exploded. A wireless charger sits on a fixture
 * plate, a phone hovers above it on dashed drops, and a coin lies on the
 * charger's face at one of 25 alignments, marked by a 5 × 5 of dots. The
 * pointer picks the alignment; the coin is set there on the 700ms curve and
 * the dots of its row and column read medium. A click runs the test: the phone
 * sets down on the coin, a charging bolt lights on its screen, and it lifts
 * again. The slider is the alignment pitch, in world units.
 *
 * The pattern: one of many. A hit test on the charger's top plane, which never
 * moves, snapped to the grid; tweens for the coin and the phone, and one bright
 * edge: the coin's, or the bolt's while it charges.
 */
const {
  Cam, circ, clamp, extremes, facing, fillet, fit, flatDot, mk, place, poly, prism, proj, put,
  rings, ringAt, rrect, seg, solid, tdone, tset, tval, tween, unproj, pointer, register, disposer,
} = HL;

const PL = 56, PB = 6, CR = 32, CH = 7, COIN = 5, CT = 1.8, ZP = 52, PT = 3.4;
const PX0 = -30, PX1 = 42, PY0 = -17, PY1 = 19, PHR = 7.5;
const ZD = CH + CT, REST = [3, 1], HOLD = 1200;
// The bolt on the screen, in (across, along) units of a 1 × 1 box; along runs to the phone's top, at -x.
const BOLT = [[0.15, 0.5], [-0.35, -0.06], [0, -0.06], [-0.15, -0.5], [0.35, 0.06], [0, 0.06]];
const BX = (PX0 + PX1) / 2 + 2, BY = (PY0 + PY1) / 2;

/** A ring moved to (cx, cy). */
const at = (ring, cx, cy) => ring.map((q) => ({ u: q.u + cx, v: q.v + cy, nu: q.nu, nv: q.nv }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pitch = value, cell = REST;

  const C = Cam(45, 0.5, 1.86);
  const top = ZP + PT;
  fit(C, [[-PL, -PL, -PB], [PL, PL, -PB], [PL, -PL, -PB], [-PL, PL, -PB], [PX0, PY0, top], [PX1, PY1, top], [PX1, PY0, top], [PX0, PY1, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The fixture plate, then the cable running off its far edge, then the charger over the cable's end.
  const [br, bi] = rings(-PL, -PL, PL, PL, 10, 2.2);
  put(solid(g), prism(P, front, br, bi, -PB, 0));
  const [lr, li] = rings(-PL - 2, -2.6, -18, 2.6, 2.6, 0.7);
  put(solid(g), prism(P, front, lr, li, 0, 4.4));
  // The phone's dashed drops land on the plate behind the charger, so they go before it.
  const pr = rrect(PX0, PY0, PX1, PY1, PHR, 4), ends = extremes(P, pr).slice(0, 2);
  const drops = mk("path", { class: "nf dash" }, g);
  put(solid(g), prism(P, front, circ(CR), circ(CR - 1.8), 0, CH));
  mk("path", { d: poly(ringAt(P, circ(15, 64), CH)), class: "nf lo" }, g);

  // The 25 alignments, as dots on the charger's face; the coin's row and column read medium.
  const dots = [];
  for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) dots.push({ i, j, el: flatDot(g, C, 0.75, "dot off") });
  const cross = (k) => dots.forEach((d) => d.el.setAttribute("class", d.i === k[0] || d.j === k[1] ? "dot m" : "dot off"));
  cross(REST);
  const placeDots = () => dots.forEach((d) => place(d.el, P((d.i - 2) * pitch, (d.j - 2) * pitch, CH)));

  // The coin, painted over the dots.
  const coin = solid(g);
  coin.sil.classList.add("hi");
  const tx = tween((REST[0] - 2) * pitch), ty = tween((REST[1] - 2) * pitch);

  // The phone: the slab, its screen, its island and the bolt, redrawn at height z.
  const [sr, si] = rings(PX0, PY0, PX1, PY1, PHR, 1.4);
  const scr = rrect(PX0 + 2.8, PY0 + 2.8, PX1 - 2.8, PY1 - 2.8, PHR - 2.8, 4), isl = rrect(PX0 + 5, -4.5, PX0 + 7.6, 4.5, 1.3, 3);
  const bolt = fillet(BOLT.map(([a, l]) => [BX - l * 24, BY + a * 15]), BOLT.map(() => 0.8));
  const phone = solid(g), screen = mk("path", { class: "nf lo" }, g), island = mk("path", { class: "nf lo" }, g);
  const flash = mk("path", { class: "nf hi" }, g);
  const tz = tween(ZP);
  function drawPhone(z) {
    drops.setAttribute("d", z > ZD + 0.5 ? ends.map((q) => seg(P(q.u, q.v, z), P(q.u, q.v, 0))).join("") : "");
    put(phone, prism(P, front, sr, si, z, z + PT));
    screen.setAttribute("d", poly(ringAt(P, scr, z + PT)));
    island.setAttribute("d", poly(ringAt(P, isl, z + PT)));
  }

  // The test: 0 idle, 1 setting down, 2 charging, 3 lifting.
  let phase = 0, t1 = 0, before = "rest", left = false;
  function test(now) {
    if (phase === 1 && tz.to === ZD && tdone(tz, now)) {
      phase = 2; t1 = now;
      flash.setAttribute("d", poly(bolt.map(([x, y]) => P(x, y, ZD + PT))));
      coin.sil.classList.remove("hi");
      read.textContent = "charging";
    } else if (phase === 2 && now - t1 >= HOLD) {
      phase = 3;
      flash.setAttribute("d", "");
      coin.sil.classList.add("hi");
      read.textContent = before;
      tset(tz, ZP, now, 0);
    } else if (phase === 3 && tdone(tz, now)) {
      phase = 0;
      if (left) { left = false; choose(null); }
    }
    return phase > 0;
  }

  let lx = NaN, ly = NaN, lz = NaN, dirty = true;
  const B = register(stage, (_dt, now) => {
    if (dirty) { placeDots(); dirty = false; }
    const x = tval(tx, now), y = tval(ty, now);
    if (x !== lx || y !== ly) {
      lx = x; ly = y;
      put(coin, prism(P, front, at(circ(COIN, 28), x, y), at(circ(COIN - 1, 28), x, y), CH, CH + CT));
    }
    const z = tval(tz, now);
    if (z !== lz) { lz = z; drawPhone(z); }
    const testing = test(now);
    return testing || !tdone(tx, now) || !tdone(ty, now) || !tdone(tz, now);
  });
  bag.add(B.unregister);

  /** Sets the coin at cell c, or back at rest for null. */
  function choose(c) {
    const now = performance.now(), k = c || REST;
    cell = k;
    cross(k);
    tset(tx, (k[0] - 2) * pitch, now, 0);
    tset(ty, (k[1] - 2) * pitch, now, 0);
    read.textContent = c ? `align ${c[0] + 1}·${c[1] + 1}` : "rest";
    B.wake();
  }

  /** Over the charger, picks the alignment; anywhere else keeps the coin where it is. */
  function move(p) {
    left = false;
    if (phase) return;
    const w = unproj(C, p[0], p[1], CH);
    if (Math.hypot(w[0], w[1]) > CR + 4) return;
    const c = [clamp(Math.round(w[0] / pitch) + 2, 0, 4), clamp(Math.round(w[1] / pitch) + 2, 0, 4)];
    if (c[0] !== cell[0] || c[1] !== cell[1] || read.textContent === "rest") choose(c);
  }

  /** A click anywhere runs one test at the coin's alignment, once the coin has landed. */
  function click(p) {
    if (phase) return;
    move(p);
    const now = performance.now();
    phase = 1;
    before = read.textContent;
    tset(tz, ZD, now, tdone(tx, now) && tdone(ty, now) ? 0 : 700);
    B.wake();
  }

  bag.add(pointer(stage, {
    move,
    down: click,
    leave: () => { if (phase) left = true; else choose(null); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { pitch = v; dirty = true; if (!phase) choose(read.textContent === "rest" ? null : cell); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "fod",
  means: "A coin set on a wireless charger at one of 25 alignments; a click sets the phone down on it to charge.",
  rules: [1, 4, 5, 8],
  range: [5, 7, 9],
  tour: [[200, 192], [163, 173], [237, 173], null],
  mount,
});
