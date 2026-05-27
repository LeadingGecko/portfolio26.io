/*!
 * pcb.js — Animated PCB Background
 * Draws circuit board traces, components (resistors, caps, ICs, vias),
 * and glowing signal pulses that travel through the board.
 */
(function () {
  "use strict";

  /* ── Configuration ────────────────────────────── */
  const CFG = {
    GRID:          52,          // px between grid nodes
    PROB_H:        0.36,        // probability a horizontal edge is drawn
    PROB_V:        0.36,        // probability a vertical edge is drawn
    MAX_SPAN_H:    9,           // max grid cells a single H trace spans
    MAX_SPAN_V:    7,
    MIN_GAP:       1,           // min empty cells between traces on same row/col
    MAX_GAP:       4,

    SIGNAL_COUNT:  50,
    SPD_MIN:       70,          // px/s  
    SPD_MAX:       175,         // px/s
    TRAIL_PX:      65,          // trail length in pixels

    COMP_VIA_P:    0.40,        // probability: via (at junction endpoint)
    COMP_RES_P:    0.14,        // resistor
    COMP_CAP_P:    0.10,        // capacitor
    COMP_IC_P:     0.05,        // IC chip

    TRACE_ALPHA:   0.26,
    TRACE_GLOW_A:  0.07,
    TRACE_W:       1.6,
    TRACE_GLOW_W:  5,

    SIGNAL_COL:    [0, 255, 190],
    TRACE_COL:     [0, 200, 83],
  };

  /* ── State ────────────────────────────────────── */
  const canvas = document.getElementById("pcb-canvas");
  const ctx    = canvas.getContext("2d");

  let W = 0, H = 0;
  let traces     = [];   // {x1,y1,x2,y2,len}
  let components = [];   // {x,y,type}
  let signals    = [];   // {trace, t, speedT, alpha}
  let rafId      = null;
  let lastTime   = 0;

  /* ── Geometry helpers ─────────────────────────── */
  const gx = (c) => c * CFG.GRID;
  const gy = (r) => r * CFG.GRID;

  /* ── Generation ───────────────────────────────── */
  function generate() {
    traces     = [];
    components = [];
    signals    = [];

    const cols = Math.ceil(W / CFG.GRID) + 2;
    const rows = Math.ceil(H / CFG.GRID) + 2;

    // Endpoint registry to place components
    const endpoints = new Map(); // "x,y" → count

    function addEndpoint(x, y) {
      const k = `${x},${y}`;
      endpoints.set(k, (endpoints.get(k) || 0) + 1);
    }

    // ── Horizontal traces ──
    for (let r = 0; r < rows; r++) {
      let c = 0;
      while (c < cols) {
        if (Math.random() < CFG.PROB_H) {
          const span = Math.floor(Math.random() * CFG.MAX_SPAN_H) + 1;
          const x1 = gx(c);
          const x2 = gx(Math.min(c + span, cols));
          const y  = gy(r);
          if (x2 > x1 + 4) {
            traces.push({ x1, y1: y, x2, y2: y, len: x2 - x1 });
            addEndpoint(x1, y);
            addEndpoint(x2, y);
          }
          c += span + Math.floor(Math.random() * CFG.MAX_GAP) + CFG.MIN_GAP;
        } else {
          c++;
        }
      }
    }

    // ── Vertical traces ──
    for (let c = 0; c < cols; c++) {
      let r = 0;
      while (r < rows) {
        if (Math.random() < CFG.PROB_V) {
          const span = Math.floor(Math.random() * CFG.MAX_SPAN_V) + 1;
          const y1 = gy(r);
          const y2 = gy(Math.min(r + span, rows));
          const x  = gx(c);
          if (y2 > y1 + 4) {
            traces.push({ x1: x, y1, x2: x, y2, len: y2 - y1 });
            addEndpoint(x, y1);
            addEndpoint(x, y2);
          }
          r += span + Math.floor(Math.random() * CFG.MAX_GAP) + CFG.MIN_GAP;
        } else {
          r++;
        }
      }
    }

    // ── Assign components at endpoints ──
    endpoints.forEach((count, key) => {
      const [x, y] = key.split(",").map(Number);
      const roll = Math.random();
      if      (roll < CFG.COMP_IC_P)                           components.push({ x, y, type: "ic"        });
      else if (roll < CFG.COMP_IC_P + CFG.COMP_CAP_P)         components.push({ x, y, type: "capacitor" });
      else if (roll < CFG.COMP_IC_P + CFG.COMP_CAP_P + CFG.COMP_RES_P) components.push({ x, y, type: "resistor" });
      else if (roll < CFG.COMP_IC_P + CFG.COMP_CAP_P + CFG.COMP_RES_P + CFG.COMP_VIA_P) components.push({ x, y, type: "via" });
    });

    // ── Seed signals ──
    for (let i = 0; i < CFG.SIGNAL_COUNT; i++) {
      const s = spawnSignal();
      if (s) { s.t = Math.random(); signals.push(s); }
    }
  }

  /* ── Signals ──────────────────────────────────── */
  function spawnSignal() {
    if (traces.length === 0) return null;
    const tr = traces[Math.floor(Math.random() * traces.length)];
    const spd = CFG.SPD_MIN + Math.random() * (CFG.SPD_MAX - CFG.SPD_MIN);
    return {
      trace:  tr,
      t:      -0.05,
      speedT: spd / tr.len,
      alpha:  0.5 + Math.random() * 0.5,
    };
  }

  function updateSignals(dt) {
    for (let i = 0; i < signals.length; i++) {
      signals[i].t += signals[i].speedT * dt;
      if (signals[i].t > 1.12) {
        const s = spawnSignal();
        signals[i] = s || signals[i];
      }
    }
  }

  /* ── Drawing ──────────────────────────────────── */
  function drawTrace(tr) {
    const { x1, y1, x2, y2 } = tr;
    const [r, g, b] = CFG.TRACE_COL;

    // Outer glow
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(${r},${g},${b},${CFG.TRACE_GLOW_A})`;
    ctx.lineWidth   = CFG.TRACE_GLOW_W;
    ctx.stroke();

    // Core line
    ctx.beginPath();
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(${r},${g},${b},${CFG.TRACE_ALPHA})`;
    ctx.lineWidth   = CFG.TRACE_W;
    ctx.stroke();
  }

  function drawSignal(s) {
    const { trace: tr, t, alpha } = s;
    const { x1, y1, x2, y2, len } = tr;
    const [sr, sg, sb] = CFG.SIGNAL_COL;

    const tc  = Math.max(0, Math.min(1, t));
    const px  = x1 + (x2 - x1) * tc;
    const py  = y1 + (y2 - y1) * tc;

    const trailT = CFG.TRAIL_PX / len;
    const t0  = Math.max(0, tc - trailT);
    const px0 = x1 + (x2 - x1) * t0;
    const py0 = y1 + (y2 - y1) * t0;

    // Skip degenerate gradient (head == tail)
    const dx = px - px0, dy = py - py0;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

    // Trailing gradient
    const grad = ctx.createLinearGradient(px0, py0, px, py);
    grad.addColorStop(0,   `rgba(${sr},${sg},${sb},0)`);
    grad.addColorStop(0.5, `rgba(${sr},${sg},${sb},${alpha * 0.35})`);
    grad.addColorStop(1,   `rgba(${sr},${sg},${sb},${alpha * 0.9})`);

    ctx.beginPath();
    ctx.moveTo(px0, py0); ctx.lineTo(px, py);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 2.2;
    ctx.stroke();

    // Head glow — only when actually on the trace
    if (t >= 0 && t <= 1.02) {
      const rad  = 5;
      const hGrd = ctx.createRadialGradient(px, py, 0, px, py, rad);
      hGrd.addColorStop(0,   `rgba(200,255,240,${alpha})`);
      hGrd.addColorStop(0.4, `rgba(${sr},${sg},${sb},${alpha * 0.7})`);
      hGrd.addColorStop(1,   `rgba(${sr},${sg},${sb},0)`);

      ctx.beginPath();
      ctx.arc(px, py, rad, 0, Math.PI * 2);
      ctx.fillStyle = hGrd;
      ctx.fill();
    }
  }

  function drawComponents() {
    const [tr, tg, tb] = CFG.TRACE_COL;
    const traceStr = `rgba(${tr},${tg},${tb},0.70)`;

    for (const { x, y, type } of components) {
      ctx.save();
      ctx.translate(x, y);

      switch (type) {

        /* ── Via hole (copper plated) ── */
        case "via":
          ctx.beginPath();
          ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
          ctx.fillStyle   = "rgba(184,115,51,0.42)";
          ctx.strokeStyle = "rgba(184,115,51,0.80)";
          ctx.lineWidth   = 1;
          ctx.fill(); ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(3,8,5,1)";
          ctx.fill();
          break;

        /* ── Resistor (0402 style + bands) ── */
        case "resistor": {
          const W = 13, H = 6;
          ctx.strokeStyle = traceStr;
          ctx.lineWidth   = 1;
          // Leads
          ctx.beginPath();
          ctx.moveTo(-W / 2 - 7, 0); ctx.lineTo(-W / 2, 0);
          ctx.moveTo( W / 2,     0); ctx.lineTo( W / 2 + 7, 0);
          ctx.stroke();
          // Body
          ctx.fillStyle = "rgba(3,12,5,0.95)";
          ctx.fillRect(-W / 2, -H / 2, W, H);
          ctx.strokeRect(-W / 2, -H / 2, W, H);
          // Bands
          const bands = [
            "rgba(0,229,255,0.65)",
            "rgba(57,255,20,0.55)",
            "rgba(255,200,60,0.55)",
          ];
          ctx.lineWidth = 1.4;
          [-3.5, 0, 3.5].forEach((bx, i) => {
            ctx.strokeStyle = bands[i];
            ctx.beginPath();
            ctx.moveTo(bx, -H / 2 + 1); ctx.lineTo(bx, H / 2 - 1);
            ctx.stroke();
          });
          break;
        }

        /* ── Capacitor (0402, polarized) ── */
        case "capacitor": {
          const PH = 11;
          ctx.strokeStyle = traceStr;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(-11, 0); ctx.lineTo(-3, 0);
          ctx.moveTo(  3, 0); ctx.lineTo(11, 0);
          ctx.stroke();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-3, -PH / 2); ctx.lineTo(-3, PH / 2);
          ctx.moveTo( 3, -PH / 2); ctx.lineTo( 3, PH / 2);
          ctx.stroke();
          // Polarity + sign
          ctx.lineWidth   = 1;
          ctx.strokeStyle = "rgba(0,229,255,0.6)";
          ctx.beginPath();
          ctx.moveTo(-6, -3); ctx.lineTo(-6, -6);
          ctx.moveTo(-7.5, -4.5); ctx.lineTo(-4.5, -4.5);
          ctx.stroke();
          break;
        }

        /* ── IC chip (SOIC style) ── */
        case "ic": {
          const BW = 24, BH = 18;
          ctx.fillStyle   = "rgba(3,10,5,0.96)";
          ctx.strokeStyle = traceStr;
          ctx.lineWidth   = 1;
          ctx.fillRect(-BW / 2, -BH / 2, BW, BH);
          ctx.strokeRect(-BW / 2, -BH / 2, BW, BH);
          // Pin-1 notch
          ctx.beginPath();
          ctx.arc(-BW / 2 + 4, -BH / 2, 2.5, Math.PI, 0);
          ctx.fillStyle = "rgba(2,7,3,1)";
          ctx.fill();
          // Legs — top / bottom
          ctx.strokeStyle = `rgba(${tr},${tg},${tb},0.55)`;
          [-7, 0, 7].forEach((lx) => {
            ctx.beginPath();
            ctx.moveTo(lx, -BH / 2); ctx.lineTo(lx, -BH / 2 - 5);
            ctx.moveTo(lx,  BH / 2); ctx.lineTo(lx,  BH / 2 + 5);
            ctx.stroke();
          });
          // Legs — left / right
          [-5, 5].forEach((ly) => {
            ctx.beginPath();
            ctx.moveTo(-BW / 2, ly); ctx.lineTo(-BW / 2 - 5, ly);
            ctx.moveTo( BW / 2, ly); ctx.lineTo( BW / 2 + 5, ly);
            ctx.stroke();
          });
          // Tiny label
          ctx.fillStyle   = `rgba(${tr},${tg},${tb},0.30)`;
          ctx.font        = "5px 'Share Tech Mono', monospace";
          ctx.textAlign   = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("MCU", 1, 1);
          break;
        }
      }

      ctx.restore();
    }
  }

  /* ── Render loop ──────────────────────────────── */
  function render(time) {
    rafId = requestAnimationFrame(render);

    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    ctx.clearRect(0, 0, W, H);
    updateSignals(dt);
    traces.forEach(drawTrace);
    drawComponents();
    signals.forEach(drawSignal);
  }

  /* ── Resize ───────────────────────────────────── */
  let resizeTimer = null;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    generate();
  }

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  /* ── Boot ─────────────────────────────────────── */
  resize();
  rafId = requestAnimationFrame(render);
})();
