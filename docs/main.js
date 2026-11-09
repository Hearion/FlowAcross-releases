/*
 * 流界官网脚本：
 * 1. 首屏交互演示——和应用一样的规则：只有相贴的边（蓝色接缝）能跨过去，其余边把光标挡住；
 *    可选「贴边停留 0.3 秒才跨屏」；Ctrl+Alt+←/→ 直接切换；键盘输入跟着光标走。
 * 2. 按访问者的系统突出对应的下载。
 * 3. 顶栏滚动后出现分隔线。
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ 顶栏 ============ */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ 按系统推荐下载 ============ */
  (function () {
    var ua = navigator.userAgent;
    var touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPadOS 伪装成 Mac
    var mobile = /iPhone|iPad|iPod|Android/.test(ua) || touchMac;
    var os = mobile ? "mobile" : /Macintosh|Mac OS X/.test(ua) ? "mac" : /Windows/.test(ua) ? "win" : "other";

    var cta = document.querySelector("[data-os-cta]");
    var label = document.querySelector("[data-os-label]");
    var note = document.querySelector("[data-os-note]");

    if (os === "mac" || os === "win") {
      label.textContent = os === "mac" ? "下载 macOS 版" : "下载 Windows 版";
      note.innerHTML =
        os === "mac"
          ? 'Apple 芯片与 Intel 通用。另一台是 Windows？<a href="#download">也在这里下载</a>'
          : 'Windows 10 及以上。另一台是 Mac？<a href="#download">也在这里下载</a>';
      var card = document.querySelector('.dl-card[data-os="' + os + '"]');
      if (card) {
        card.classList.add("recommended");
        var rec = document.createElement("span");
        rec.className = "rec-label";
        rec.textContent = "这台电脑";
        card.querySelector(".dl-title").appendChild(rec);
      }
    } else if (os === "mobile") {
      label.textContent = "查看下载";
      cta.setAttribute("href", "#download");
      note.textContent = "流界运行在 Mac 和 Windows 上，可以在电脑上打开本页下载。";
    }
  })();

  /* ============ 交互演示 ============ */
  var stage = document.getElementById("stage");
  var inner = document.getElementById("stage-inner");
  if (!stage || !inner) return;

  var screens = Array.prototype.slice.call(inner.querySelectorAll(".screen"));
  var typed = screens.map(function (s) {
    return s.querySelector(".typed");
  });
  var seamEl = document.getElementById("seam");
  var cursorEl = document.getElementById("cursor");
  var dwellEl = document.getElementById("dwell");
  var statusName = document.getElementById("status-name");
  var dwellToggle = document.getElementById("dwell-toggle");
  var hint = document.getElementById("demo-hint");

  var NAMES = ["MacBook Pro", "书房台式机"];
  var DWELL_MS = 300;
  var MAX_CHARS = 26;

  // 布局空间（单位：演示画布的逻辑点）。两块屏幕的相贴部分就是接缝。
  var LAYOUTS = {
    wide: {
      W: 1000,
      H: 520,
      rects: [
        { x: 100, y: 170, w: 380, h: 246 },
        { x: 494, y: 104, w: 420, h: 236 },
      ],
    },
    narrow: {
      W: 1000,
      H: 640,
      rects: [
        { x: 24, y: 230, w: 432, h: 278 },
        { x: 478, y: 150, w: 498, h: 280 },
      ],
    },
  };

  var narrowMq = window.matchMedia("(max-width: 720px)");
  var L, seamX, seamTop, seamBottom;
  var active = 0;
  var cx = 0;
  var cy = 0;

  function applyLayout() {
    var prev = L;
    L = narrowMq.matches ? LAYOUTS.narrow : LAYOUTS.wide;
    var a = L.rects[0];
    var b = L.rects[1];
    seamX = (a.x + a.w + b.x) / 2;
    seamTop = Math.max(a.y, b.y);
    seamBottom = Math.min(a.y + a.h, b.y + b.h);

    screens.forEach(function (el, i) {
      var r = L.rects[i];
      el.style.left = pct(r.x, L.W);
      el.style.top = pct(r.y, L.H);
      el.style.width = pct(r.w, L.W);
      el.style.height = pct(r.h, L.H);
    });
    seamEl.style.left = pct(seamX, L.W);
    seamEl.style.top = pct(seamTop, L.H);
    seamEl.style.height = pct(seamBottom - seamTop, L.H);

    if (prev) {
      // 换布局时按相对位置把光标搬过去
      var pr = prev.rects[active];
      var nr = L.rects[active];
      cx = nr.x + ((cx - pr.x) / pr.w) * nr.w;
      cy = nr.y + ((cy - pr.y) / pr.h) * nr.h;
    }
    render();
  }

  function pct(v, total) {
    return (v / total) * 100 + "%";
  }

  function center(i) {
    var r = L.rects[i];
    return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  }

  function inside(r, x, y) {
    return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }

  function clampTo(r, x, y) {
    return {
      x: Math.min(r.x + r.w, Math.max(r.x, x)),
      y: Math.min(r.y + r.h, Math.max(r.y, y)),
    };
  }

  function render() {
    var box = inner.getBoundingClientRect();
    var px = (cx / L.W) * box.width;
    var py = (cy / L.H) * box.height;
    cursorEl.style.transform = "translate(" + px + "px," + py + "px)";
    dwellEl.style.transform = "translate(" + px + "px," + py + "px)";
  }

  function setActive(i, flashY) {
    if (i === active) return;
    active = i;
    screens.forEach(function (el, j) {
      el.classList.toggle("active", j === i);
    });
    statusName.textContent = NAMES[i];
    if (flashY !== undefined && !reduceMotion) {
      seamEl.classList.remove("flash");
      void seamEl.offsetWidth; // 重新触发动画
      seamEl.classList.add("flash");
    }
  }

  /* ---- 贴边停留：定时器判定，进度圈用 CSS 过渡画 ---- */
  var push = null; // { tx, ty, timer }

  function resetDwell() {
    if (!push) return;
    clearTimeout(push.timer);
    push = null;
    dwellEl.classList.remove("on", "run");
  }

  function startDwell(tx, ty) {
    push = { tx: tx, ty: ty, timer: 0 };
    push.timer = setTimeout(function () {
      var t = push;
      resetDwell();
      if (t) crossTo(t.tx, t.ty);
    }, DWELL_MS);
    dwellEl.classList.add("on");
    void dwellEl.offsetWidth; // 让进度圈从 0 开始
    dwellEl.classList.add("run");
  }

  function crossTo(tx, ty) {
    var other = 1 - active;
    var p = clampTo(L.rects[other], tx, ty);
    setActive(other, p.y);
    cx = p.x;
    cy = p.y;
    render();
  }

  /*
   * 光标想去 (tx, ty)。和 flow-core 的规则一致：
   * 在当前屏幕内就照走；朝另一台推、且穿过接缝的那一段，才跨过去；其余情况被屏幕边挡住。
   */
  function moveTo(tx, ty) {
    var r = L.rects[active];
    if (inside(r, tx, ty)) {
      cx = tx;
      cy = ty;
      resetDwell();
      render();
      return;
    }

    var beyond = active === 0 ? tx > seamX : tx < seamX;
    var yi = null;
    if (beyond && tx !== cx) {
      var t = (seamX - cx) / (tx - cx);
      if (t >= 0 && t <= 1) yi = cy + t * (ty - cy);
    }
    var crossing = yi !== null && yi >= seamTop && yi <= seamBottom;

    if (crossing && !dwellToggle.checked) {
      resetDwell();
      crossTo(tx, ty);
      return;
    }

    if (crossing) {
      // 停在接缝上，开始或继续计时
      cx = active === 0 ? r.x + r.w : r.x;
      cy = Math.min(seamBottom, Math.max(seamTop, yi));
      if (!push) {
        startDwell(tx, ty);
      } else {
        push.tx = tx;
        push.ty = ty;
      }
      render();
      return;
    }

    resetDwell();
    var p = clampTo(r, tx, ty);
    cx = p.x;
    cy = p.y;
    render();
  }

  function warpTo(tx, ty) {
    // 指针刚进入画布：光标直接出现在指针所在（或最近）的屏幕上
    var i = inside(L.rects[1], tx, ty) ? 1 : inside(L.rects[0], tx, ty) ? 0 : nearest(tx, ty);
    var p = clampTo(L.rects[i], tx, ty);
    setActive(i);
    cx = p.x;
    cy = p.y;
    resetDwell();
    render();
  }

  function nearest(x, y) {
    var d = L.rects.map(function (r) {
      var p = clampTo(r, x, y);
      return Math.hypot(p.x - x, p.y - y);
    });
    return d[0] <= d[1] ? 0 : 1;
  }

  function toUnits(e) {
    var box = inner.getBoundingClientRect();
    return {
      x: ((e.clientX - box.left) / box.width) * L.W,
      y: ((e.clientY - box.top) / box.height) * L.H,
    };
  }

  /* ---- 指针 ---- */
  var mouseInside = false;
  var touchLast = null;

  stage.addEventListener("pointerenter", function (e) {
    if (e.pointerType !== "mouse") return;
    stopAutoplay();
    var u = toUnits(e);
    mouseInside = true;
    warpTo(u.x, u.y);
  });

  stage.addEventListener("pointerleave", function (e) {
    if (e.pointerType === "mouse") {
      mouseInside = false;
      resetDwell();
    }
  });

  stage.addEventListener("pointermove", function (e) {
    if (e.pointerType === "mouse") {
      var u = toUnits(e);
      if (!mouseInside) {
        mouseInside = true;
        stopAutoplay();
        warpTo(u.x, u.y);
        return;
      }
      moveTo(u.x, u.y);
      return;
    }
    // 触屏：像触控板一样按位移推动光标
    if (!touchLast) return;
    var box = inner.getBoundingClientRect();
    var k = (L.W / box.width) * 1.25;
    var dx = (e.clientX - touchLast.x) * k;
    var dy = (e.clientY - touchLast.y) * k;
    touchLast = { x: e.clientX, y: e.clientY };
    moveTo(cx + dx, cy + dy);
  });

  stage.addEventListener("pointerdown", function (e) {
    stopAutoplay();
    if (e.pointerType === "mouse") return;
    touchLast = { x: e.clientX, y: e.clientY };
    try {
      stage.setPointerCapture(e.pointerId);
    } catch (_) {
      /* 部分浏览器不支持，忽略 */
    }
  });

  function endTouch() {
    touchLast = null;
    resetDwell();
  }
  stage.addEventListener("pointerup", endTouch);
  stage.addEventListener("pointercancel", endTouch);

  /* ---- 键盘：画布里藏着一个输入框，这样输入法（中文等）也能用 ---- */
  var input = document.getElementById("demo-input");

  stage.addEventListener("mousedown", function (e) {
    e.preventDefault(); // 不让焦点落到 body 上
    input.focus({ preventScroll: true });
  });

  function flushInput() {
    var v = input.value;
    if (!v) return;
    input.value = "";
    stopAutoplay();
    Array.from(v).forEach(function (ch) {
      typeChar(active, ch);
    });
  }
  input.addEventListener("input", function (e) {
    if (!e.isComposing) flushInput();
  });
  input.addEventListener("compositionend", flushInput);

  input.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      stopAutoplay();
      var target = e.key === "ArrowLeft" ? 0 : 1;
      if (target !== active) {
        var c = center(target);
        setActive(target, c.y);
        cx = c.x;
        cy = c.y;
        resetDwell();
        render();
      }
      return;
    }
    if (e.key === "Backspace" && !e.isComposing && !input.value) {
      e.preventDefault();
      stopAutoplay();
      typed[active].textContent = Array.from(typed[active].textContent).slice(0, -1).join("");
    }
  });

  function typeChar(i, ch) {
    var chars = Array.from(typed[i].textContent);
    chars.push(ch);
    if (chars.length > MAX_CHARS) chars = chars.slice(chars.length - MAX_CHARS);
    typed[i].textContent = chars.join("");
  }

  dwellToggle.addEventListener("change", resetDwell);

  /* ---- 首次进入视野时播放一次：在 Mac 上打字 → 光标滑过接缝 → 在 Windows 上接着打 ---- */
  var LINE_A = "在 Mac 上写一半";
  var LINE_B = "到 Windows 接着写";
  var timers = [];
  var autoRaf = 0;
  var autoplaying = false;

  function stopAutoplay() {
    if (!autoplaying) return;
    autoplaying = false;
    timers.forEach(clearTimeout);
    timers = [];
    if (autoRaf) cancelAnimationFrame(autoRaf);
    autoRaf = 0;
  }

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function typeLine(i, text, startMs, stepMs) {
    Array.from(text).forEach(function (ch, k) {
      later(function () {
        typeChar(i, ch);
      }, startMs + k * stepMs);
    });
    return startMs + text.length * stepMs;
  }

  function glide(from, to, ms, done) {
    var t0 = performance.now();
    function step(now) {
      if (!autoplaying) return;
      var t = Math.min(1, (now - t0) / ms);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      // 轻微的弧线，像手在移动
      var x = from.x + (to.x - from.x) * e;
      var y = from.y + (to.y - from.y) * e - Math.sin(Math.PI * e) * 24;
      moveTo(x, y);
      if (t < 1) autoRaf = requestAnimationFrame(step);
      else if (done) done();
    }
    autoRaf = requestAnimationFrame(step);
  }

  function startAutoplay() {
    autoplaying = true;
    var b = center(1);
    var tEnd = typeLine(0, LINE_A, 500, 90);
    later(function () {
      glide({ x: cx, y: cy }, { x: b.x - 20, y: b.y + 10 }, 1300, function () {
        var tB = typeLine(1, LINE_B, 300, 90);
        later(function () {
          autoplaying = false;
        }, tB);
      });
    }, tEnd + 500);
  }

  /* ---- 初始化 ---- */
  typed.forEach(function (el) {
    el.setAttribute("data-placeholder", "键盘输入会出现在这里");
  });

  if (window.matchMedia("(hover: none)").matches) {
    hint.innerHTML =
      '在画布上左右拖动，像用触控板一样把光标推过<span class="seam-chip" aria-hidden="true"></span>蓝色接缝。';
  }

  applyLayout();
  var start = center(0);
  cx = start.x - 30;
  cy = start.y + 20;
  active = -1;
  setActive(0);
  render();

  narrowMq.addEventListener("change", applyLayout);
  window.addEventListener("resize", render, { passive: true });

  if (reduceMotion) {
    // 不播放动画，直接给出最终状态
    typed[0].textContent = LINE_A;
    typed[1].textContent = LINE_B;
    var c1 = center(1);
    setActive(1);
    cx = c1.x;
    cy = c1.y;
    render();
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          io.disconnect();
          startAutoplay();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(stage);
  } else {
    startAutoplay();
  }
})();
