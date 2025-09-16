const SCENES = {
  hogwarts: {
    overlay: null,
    baseImage: "./img/castle.png",
    hotspots: [
      {
        id: "o-1",
        x: 73,
        y: 33,
        title: "暴れ柳",
        desc: "このテキストはダミーです。",
        image: "./img/tree.jpg",
      },
      {
        id: "o-2",
        x: 63,
        y: 60,
        title: "黒い湖",
        desc: "このテキストはダミーです。",
        image: "./img/boat.jpg",
      },
      {
        id: "o-3",
        x: 55,
        y: 40,
        title: "大広間",
        desc: "このテキストはダミーです。",
        image: "./img/christmas.jpg",
      },
    ],
  },
  hogsmead: {
    overlay: null,
    baseImage: "./img/Hogsmead.jpg",
    hotspots: [
      {
        id: "l-1",
        x: 11,
        y: 25,
        title: "ホグズミード",
        desc: "このテキストはダミーです。",
        image: "./img/hogsmead01.jpg",
      },
      {
        id: "l-2",
        x: 20,
        y: 17,
        title: "バタービール",
        desc: "このテキストはダミーです。",
        image: "./img/beer.jpg",
      },
    ],
  },
  qudditch: {
    overlay: null,
    baseImage: "./img/Qudditch.jpg",
    hotspots: [
      {
        id: "lib-1",
        x: 40,
        y: 23,
        title: "クィディッチ",
        desc: "このテキストはダミーです。",
        image: "./img/sport.jpeg",
      },
    ],
  },
  forest: {
    overlay: null,
    baseImage: "./img/Forest.jpg",
    hotspots: [
      {
        id: "o-1",
        x: 95,
        y: 30,
        title: "人狼",
        desc: "このテキストはダミーです。",
        image: "./img/wolf.jpg",
      },
      {
        id: "o-2",
        x: 90,
        y: 18,
        title: "アラゴグ",
        desc: "このテキストはダミーです。",
        image: "./img/spider.jpg",
      },
    ],
  },

  original: {
    overlay: null,
    baseImage: "./img/campus.jpg",
    hotspots: [],
  },
};

const sceneEl = document.querySelector(".scene");
const baseImg = document.getElementById("base");
const imageWrap = document.querySelector(".image-wrap");
const tabs = Array.from(document.querySelectorAll(".tab"));
const hotspotsEl = document.querySelector(".hotspots");
const tooltipEl = document.getElementById("tooltip");
const tipTitleEl = tooltipEl?.querySelector(".tooltip__title");
const tipDescEl = tooltipEl?.querySelector(".tooltip__desc");
const tipImageEl = tooltipEl?.querySelector(".tooltip__image");
const tipCloseEl = tooltipEl?.querySelector(".tooltip__close");
const zoomOverlay = document.querySelector(".zoom-overlay");

let activeArea = "original";
let lensElement = null;

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const area = tab.dataset.area;
    if (area === activeArea) return;

    tabs.forEach((t) => t.classList.toggle("is-active", t === tab));

    const sceneData = SCENES[area];
    if (sceneData && sceneData.baseImage) {
      baseImg.src = sceneData.baseImage;
      if (zoomOverlay) {
        zoomOverlay.src = sceneData.baseImage;
        zoomOverlay.style.clipPath = "circle(0px at 0 0)";
      }
    }

    renderHotspots(area);

    closeTip();

    activeArea = area;
  });
});

function renderHotspots(area) {
  const data = SCENES[area];

  if (!hotspotsEl) {
    return;
  }

  hotspotsEl.innerHTML = "";

  const imgRect = baseImg.getBoundingClientRect();
  const sceneRect = sceneEl.getBoundingClientRect();

  data.hotspots.forEach((h) => {
    const btn = document.createElement("button");
    btn.className = "hotspot";
    btn.type = "button";
    btn.dataset.id = h.id;
    btn.setAttribute("aria-label", h.title);

    const dot = document.createElement("span");
    dot.className = "dot";
    btn.appendChild(dot);

    const px = (h.x / 100) * imgRect.width + (imgRect.left - sceneRect.left);
    const py = (h.y / 100) * imgRect.height + (imgRect.top - sceneRect.top);
    btn.style.left = `${px}px`;
    btn.style.top = `${py}px`;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openTipAt(btn, h.title, h.desc, h.image);
    });

    hotspotsEl.appendChild(btn);
  });
}

function openTipAt(anchorBtn, title, desc, image) {
  tipTitleEl.textContent = title;
  tipDescEl.textContent = desc;

  if (image && tipImageEl) {
    tipImageEl.src = image;
    tipImageEl.style.display = "block";
  } else if (tipImageEl) {
    tipImageEl.style.display = "none";
  }

  tooltipEl.hidden = false;

  const s = sceneEl.getBoundingClientRect();
  const r = anchorBtn.getBoundingClientRect();
  const tooltipWidth = 220;
  const hotspotCenterX = r.left + r.width / 2;
  const tooltipLeft = hotspotCenterX - tooltipWidth / 2;

  tooltipEl.style.left = `${tooltipLeft - s.left}px`;
  tooltipEl.style.top = `${r.bottom - s.top + 14}px`;

  clampTooltip(tooltipEl, s);

  const nr = tooltipEl.getBoundingClientRect();
  const arrow = tooltipEl.querySelector(".tooltip__arrow");

  arrow.classList.remove(
    "tooltip__arrow--left",
    "tooltip__arrow--right",
    "tooltip__arrow--bottom"
  );
  arrow.classList.add("tooltip__arrow--top");
}

function closeTip() {
  tooltipEl.hidden = true;
}

function clampTooltip(tip, sceneRect) {
  const pad = 8;
  const r = tip.getBoundingClientRect();
  let x = r.left - sceneRect.left;
  let y = r.top - sceneRect.top;

  const maxX = sceneRect.width - r.width - pad;
  const maxY = sceneRect.height - r.height - pad;
  x = Math.max(pad, Math.min(x, maxX));
  y = Math.max(pad, Math.min(y, maxY));

  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
}

function reflowHotspots() {
  renderHotspots(activeArea);
  if (tooltipEl && !tooltipEl.hidden) closeTip();
}

if (tipCloseEl) {
  tipCloseEl.addEventListener("click", (e) => {
    e.stopPropagation();
    closeTip();
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".hotspot") && !e.target.closest("#tooltip")) {
    closeTip();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTip();
  }
});

window.addEventListener("resize", () => {
  cancelAnimationFrame(reflowHotspots._raf);
  reflowHotspots._raf = requestAnimationFrame(reflowHotspots);
});

function init() {
  renderHotspots(activeArea);

  initMagnifier();
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

function initMagnifier() {
  const wrap = document.querySelector(".image-wrap");
  const zoom = document.querySelector(".zoom-overlay");

  // レンズ要素生成
  if (!lensElement) {
    lensElement = document.createElement("div");
    lensElement.className = "lens";
    lensElement.setAttribute("aria-hidden", "true");
    wrap.appendChild(lensElement);
  }

  if (wrap && zoom) {
    wrap.addEventListener("mousemove", (e) => {
      if (activeArea === "original") {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // ズームオーバーレイ更新 (scale 1.7に合わせて60px半径)
        zoom.style.clipPath = `circle(60px at ${x}px ${y}px)`;
        zoom.style.transformOrigin = `${x}px ${y}px`;

        // レンズ位置更新 (scale 1.7適用)
        lensElement.style.left = `${x}px`;
        lensElement.style.top = `${y}px`;
        lensElement.style.opacity = "1";
      }
    });

    wrap.addEventListener("mouseleave", () => {
      if (activeArea === "original") {
        zoom.style.clipPath = "circle(0px at 0 0)";
        lensElement.style.opacity = "0";
      }
    });
  }
}
