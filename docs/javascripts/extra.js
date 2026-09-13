/* cybercompile — homepage hero field + search wiring.
   Ported from the previous Next.js hero-background component. */

(function () {
  "use strict";

  // Deterministic PRNG (fixed seed) so the layout is stable between loads.
  function mulberry32(seed) {
    let state = seed;
    return function () {
      state |= 0;
      state = (state + 0x6d2b79f5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var EMOJI = [
    "🛡️", "🔒", "🔑", "🐛", "💻", "🌐", "⚡", "🕵️", "🧬", "📡",
    "🔓", "🖥️", "📱", "⌨️", "🔐", "🤖", "👾", "🛰️", "💾", "💿",
    "🔌", "📶", "🚨", "🕸️", "🔍", "🗝️", "📊", "🔬", "🧪", "⚙️",
    "🛠️", "🧰", "🔦", "🔗", "🎯", "🚀", "☁️", "🗂️", "🔏", "✅",
    "⚠️", "🐍", "🧭", "👁️", "🧲", "📟", "🧿"
  ];

  // A small subset of the lucide icons the old hero used, as inline SVG bodies.
  var ICONS = [
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/>',
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    '<path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
    '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>'
  ];

  function svg(body, size) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + body + "</svg>"
    );
  }

  function buildHero(container) {
    if (!container || container.dataset.kbBuilt === "1") return;
    container.dataset.kbBuilt = "1";

    var rand = mulberry32(20260907);
    var cols = 12;
    var rows = 8;
    var cellW = 100 / cols;
    var cellH = 100 / rows;
    var frag = document.createDocumentFragment();

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (rand() < 0.12) continue;

        var left = c * cellW + cellW * 0.15 + rand() * cellW * 0.7;
        var top = r * cellH + cellH * 0.15 + rand() * cellH * 0.7;

        var distX = Math.abs(left - 50) / 50;
        var distY = Math.abs(top - 50) / 50;
        var centerFade = Math.min(1, Math.max(distX, distY) * 1.5 + 0.12);
        var opacity = Math.min(0.4, (0.14 + rand() * 0.22) * centerFade);

        var size = 12 + Math.floor(rand() * 12);
        var duration = 6 + rand() * 5;
        var delay = rand() * 4;

        var node = document.createElement("div");
        node.className = "kb-hero-node";
        node.style.top = top + "%";
        node.style.left = left + "%";
        node.style.opacity = String(opacity);
        node.style.setProperty("--float-duration", duration + "s");
        node.style.setProperty("--float-delay", delay + "s");

        if (rand() < 0.7) {
          node.style.fontSize = size + "px";
          node.textContent = EMOJI[Math.floor(rand() * EMOJI.length)];
        } else {
          node.innerHTML = svg(ICONS[Math.floor(rand() * ICONS.length)], size);
        }
        frag.appendChild(node);
      }
    }
    container.appendChild(frag);
  }

  function openSearch() {
    var toggle = document.getElementById("__search");
    if (toggle) {
      toggle.checked = true;
      // Let Material react to the toggle before focusing the input.
      requestAnimationFrame(function () {
        var input = document.querySelector(".md-search__input");
        if (input) input.focus();
      });
    }
  }

  function init() {
    var nodes = document.querySelector("[data-kb-nodes]");
    if (nodes) buildHero(nodes);

    var searchBtn = document.querySelector("[data-kb-search]");
    if (searchBtn && searchBtn.dataset.kbWired !== "1") {
      searchBtn.dataset.kbWired = "1";
      searchBtn.addEventListener("click", openSearch);
    }
  }

  // Material's instant navigation exposes document$; fall back to DOM ready.
  if (typeof window.document$ !== "undefined" && window.document$.subscribe) {
    window.document$.subscribe(init);
  } else if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
