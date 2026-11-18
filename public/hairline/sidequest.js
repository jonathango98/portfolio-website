/**
 * Side Quest: two phones on a table. The near one, a scanner, turns on its
 * edge to aim its back camera wherever the pointer is; the far one shows a
 * personal code. Over the code it locks on and dashed sight lines run to the
 * code's corners. A click scans: a bright line sweeps down the code, the
 * scanner's score row gains a dot, and the code redraws, so it never pays
 * twice. The slider is the code's grid, modules per side.
 *
 * The pattern: a spring for where (the scanner's turn), a tween for which
 * (the sweep). The lock tests the far phone's screen, which never moves.
 */
const {
  Cam, clamp, circ, fit, lerp, mk, open, place, poly, prism, proj, facing, put, rad, rings,
  rrect, seg, solid, spring, stepS, tdone, tset, tval, tween, unproj, pointer, register, disposer,
} = HL;

const T = 3, PW = 38, PH = 78, R = 7, BZ = 3, AX = 0, BX = 66, REST = 16, LO = -12, HI = 30;
const QZ = PH * 0.57, Q = 26, VF = 22, SCORE = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let n = clamp(Math.round(value), 5, 9), seed = 7, score = 2;

  const C = Cam(45, 0.5, 1.72);
  const h = PW / 2;
  fit(C, [[-22, -34, -5], [88, 34, -5], [88, -34, 0], [-22, 34, 0], [0, -h, PH], [0, h, PH],
    [BX - h, -h, PH], [BX + h, h, PH], [BX + h, -h, PH], [BX - h, h, PH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A phone's frame: n along its face normal, u across it, v up, turned th degrees about its foot. */
  const frame = (cx, th) => {
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    return (nn, u, v) => P(cx + nn * c - u * s, nn * s + u * c, v);
  };
  const plate = (F, nn, u0, v0, u1, v1, r) => poly(rrect(u0, v0, u1, v1, r, 4).map((q) => F(nn, q.u, q.v)));

  // The table.
  const [tr, ti] = rings(-22, -34, 88, 34, 10, 1.6);
  put(solid(g), prism(P, front, tr, ti, -5, 0));

  // The far phone, showing its code. It never moves.
  const A = frame(AX, 0);
  mk("path", { d: plate(A, 0, -h, 0, h, PH, R), class: "lo" }, g);
  const aFace = mk("path", { d: plate(A, T, -h, 0, h, PH, R), class: "sil hi" }, g);
  mk("path", { d: plate(A, T, -h + BZ, BZ, h - BZ, PH - BZ, R - BZ), class: "nf lo" }, g);
  place(mk("circle", { r: 1.1, class: "dot m" }, g), A(T, 0, PH - BZ / 2));
  const qg = mk("g", {}, g);
  const sweep = mk("path", { class: "nf hi" }, g);

  /** Draws a fresh code: three finder squares in the corners and a scatter of modules between them. */
  function drawCode() {
    qg.replaceChildren();
    const m = Q / n, at = (i) => (i - (n - 1) / 2) * m;
    const finder = (i, j) => (i < 2 || i >= n - 2) && (j < 2 || j >= n - 2) && !(i < 2 && j < 2);
    for (const [i, j] of [[n - 2, n - 2], [0, n - 2], [n - 2, 0]]) {
      const cu = (at(i) + at(i + 1)) / 2, cv = QZ + (at(j) + at(j + 1)) / 2;
      mk("path", { d: plate(A, T, cu - m + 0.4, cv - m + 0.4, cu + m - 0.4, cv + m - 0.4, 1.2), class: "nf" }, qg);
      place(mk("circle", { r: 1.1, class: "dot m" }, qg), A(T, cu, cv));
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      seed = (seed * 16807) % 2147483647;
      if (finder(i, j) || seed % 2) continue;
      place(mk("circle", { r: 0.9, class: "dot m" }, qg), A(T, at(i), QZ + at(j)));
    }
  }

  // Sight lines from the scanner's back camera to the code's corners, painted under the scanner.
  const sight = mk("path", { class: "dash" }, g);

  // The scanner: plates redrawn as it turns, a viewfinder, and its score row.
  const bg = mk("g", {}, g);
  const bBack = mk("path", { class: "lo" }, bg), bFace = mk("path", { class: "sil" }, bg);
  const bScreen = mk("path", { class: "nf lo" }, bg), bFinder = mk("path", { class: "nf" }, bg);
  const bCam = mk("circle", { r: 1.1, class: "dot m" }, bg);
  const dots = Array.from({ length: SCORE }, () => mk("circle", { r: 1.3, class: "dot off" }, bg));
  let lastYaw = NaN;
  function drawB(th) {
    if (th === lastYaw) return;
    lastYaw = th;
    const B = frame(BX, th), v = VF / 2, k = 6;
    bBack.setAttribute("d", plate(B, -T, -h, 0, h, PH, R));
    bFace.setAttribute("d", plate(B, 0, -h, 0, h, PH, R));
    bScreen.setAttribute("d", plate(B, 0, -h + BZ, BZ, h - BZ, PH - BZ, R - BZ));
    bFinder.setAttribute("d", [[1, 1], [-1, 1], [-1, -1], [1, -1]]
      .map(([su, sv]) => open([B(0, su * (v - k), QZ + sv * v), B(0, su * v, QZ + sv * v), B(0, su * v, QZ + sv * (v - k))])).join(""));
    place(bCam, B(0, 0, PH - BZ / 2));
    dots.forEach((d, i) => place(d, B(0, ((SCORE - 1) / 2 - i) * 5, 13)));
    const cam = B(-T, 5, PH - 12);
    sight.setAttribute("d", lock || phase === 1 ? [[1, 1], [-1, 1], [-1, -1], [1, -1]]
      .map(([su, sv]) => seg(cam, A(T, su * Q / 2, QZ + sv * Q / 2))).join("") : "");
  }
  const paintScore = (fresh) => dots.forEach((d, i) => d.setAttribute("class", i < score ? (fresh && i === score - 1 ? "dot" : "dot m") : "dot off"));

  // The lock: the pointer over the code phone's face, solved on its rest plane.
  const o = A(T, 0, 0), ey = A(T, 1, 0), ez = A(T, 0, 1);
  const ay = [ey[0] - o[0], ey[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ay[0] * az[1] - ay[1] * az[0];
  function overA([x, y]) {
    const qx = x - o[0], qy = y - o[1];
    const u = (qx * az[1] - qy * az[0]) / det, v = (ay[0] * qy - ay[1] * qx) / det;
    return Math.abs(u) <= h && v >= 0 && v <= PH;
  }

  const yaw = spring(REST);
  let lock = false, phase = 0, sc = tween(0);
  const mark = (who) => { aFace.classList.toggle("hi", who === "a"); bFace.classList.toggle("hi", who === "b"); };

  const L = register(stage, (dt, now) => {
    let moving = stepS(yaw, dt);
    lastYaw = phase === 1 ? NaN : lastYaw;
    drawB(yaw.x);
    if (phase === 1) {
      const t = tval(sc, now), w = Q / 2 + 2, z = lerp(QZ + w, QZ - w, t);
      sweep.setAttribute("d", seg(A(T, -w, z), A(T, w, z)));
      if (tdone(sc, now)) {
        phase = 2;
        sweep.setAttribute("d", "");
        if (score === SCORE) score = 0;
        score++;
        paintScore(true);
        drawCode();
        mark("b");
        read.textContent = "+10";
        lastYaw = NaN;
      } else moving = true;
    }
    return moving;
  });
  bag.add(L.unregister);

  function move(p) {
    const on = overA(p);
    if (on !== lock && phase === 2) { phase = 0; paintScore(false); }
    lock = on;
    if (on) yaw.t = 0;
    else {
      const [wx, wy] = unproj(C, p[0], p[1], PH / 2);
      yaw.t = clamp((Math.atan2(-wy, -(wx - BX)) * 180) / Math.PI, LO, HI);
    }
    if (phase === 0) { mark("a"); read.textContent = on ? "code" : "aim"; }
    lastYaw = NaN;
    L.wake();
  }

  bag.add(pointer(stage, {
    move,
    down: (p) => {
      move(p);
      if (!lock || phase === 1) return;
      phase = 1; sc = tween(0); tset(sc, 1, performance.now(), 0);
      mark(null);
      read.textContent = "scan";
      L.wake();
    },
    leave: () => {
      lock = false; yaw.t = REST; lastYaw = NaN;
      if (phase !== 1) { phase = 0; mark("a"); paintScore(false); read.textContent = "rest"; }
      L.wake();
    },
  }));
  bag.add(() => svg.replaceChildren());

  drawCode();
  paintScore(false);
  drawB(REST);

  return {
    set: (v) => { n = clamp(Math.round(v), 5, 9); drawCode(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sidequest",
  means: "Two phones on a table: the scanner turns to the pointer, locks on the other's code, and a click scans it for a point.",
  rules: [1, 4, 8, 10],
  range: [5, 7, 9],
  tour: [[150, 200], [140, 120], [300, 230], null],
  mount,
});
