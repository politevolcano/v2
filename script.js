// =======================
// GALLERY DATA
// =======================

const galleryData = [
  {
    tag: "anime",
    showOnMain: true,
    images: ["https://files.catbox.moe/671adw.webp"]
  },
  {
    tag: "anime",
    showOnMain: true,
    images: ["https://files.catbox.moe/bj1frx.webp"]
  },
  {
    tag: "western",
    showOnMain: true,
    feature: "1x2",
    images: [
      "https://files.catbox.moe/bj5w09.webp",
      "https://files.catbox.moe/zoonm6.webp"
    ]
  },
  {
    tag: "western",
    showOnMain: false,
    images: [
      "https://files.catbox.moe/k357o1.webp",
      "https://files.catbox.moe/1jgbmn.webp"
    ]
  },
  {
    tag: "western",
    showOnMain: true,
    feature: "2x1",
    images: [
      "https://files.catbox.moe/nsa5s1.webp",
      "https://files.catbox.moe/nz2ckg.webp"
    ]
  },
  {
    tag: "western",
    showOnMain: true,
    images: ["https://files.catbox.moe/xu84qc.webp"]
  },
  {
    tag: "western",
    showOnMain: false,
    images: [
      "https://files.catbox.moe/ebgd1y.webp",
      "https://files.catbox.moe/hsn3r4.webp"
    ]
  },
  {
    tag: "anime",
    showOnMain: true,
    images: [
      "https://files.catbox.moe/ekys9n.jpg",
      "https://files.catbox.moe/42um4n.webp"
    ]
  },
  {
    tag: "western",
    showOnMain: true,
    images: ["https://files.catbox.moe/ftdekl.webp"]
  },
  {
    tag: "anime",
    showOnMain: false,
    images: ["https://files.catbox.moe/74y1fp.webp"]
  },
  {
    tag: "western",
    showOnMain: false,
    thumb: "https://files.catbox.moe/pwj858.jpg",
    images: ["https://media.tenor.com/TQTVSmxhX5kAAAAj/apu-apustaja-apu.gif"]
  }
];

// =======================
// ELEMENTS
// =======================
const gallery = document.getElementById("gallery");
const tabs = document.querySelectorAll("[data-tab]");

const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const postPrev = document.getElementById("post-prev");
const postNext = document.getElementById("post-next");
const imgPrev = document.getElementById("img-prev");
const imgNext = document.getElementById("img-next");
const counter = document.getElementById("counter");
const imgNav = document.querySelector(".img-nav");
const closeBtn = document.getElementById("close");

// =======================
// STATE
// =======================
let allPosts = [];
let visiblePosts = [];
let postIndex = 0;
let imgIndex = 0;
let imgs = [];
let canClick = true;

// =======================
// TABS → HASH
// =======================
function wireTabs() {
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      location.hash = btn.dataset.tab;
    });
  });
}

// =======================
// INIT
// =======================
window.addEventListener("load", () => {
  buildGallery();
  wireTabs();
  applyViewFromHash();
  lb.classList.remove("open"); // prevent auto-open
  window.addEventListener("hashchange", applyViewFromHash); // ← REQUIRED
});


// =======================
// BUILD GALLERY
// =======================
function buildGallery() {
  gallery.innerHTML = "";
  allPosts = [];

  galleryData.forEach(entry => {
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.tag = entry.tag;
    post.dataset.main = entry.showOnMain ? "1" : "0";

    if (entry.feature) post.classList.add(`feature-${entry.feature}`);

    post.dataset.images = entry.images.join(",");

    const img = document.createElement("img");
    img.src = entry.thumb || entry.images[0];
    img.className = "thumb";
    post.appendChild(img);

    if (entry.images.length > 1) {
      const icon = document.createElement("span");
      icon.className = "multi-icon";
      icon.textContent = "⧉";
      post.appendChild(icon);
    }

    if (entry.images.some(i => i.endsWith(".gif"))) {
      const gif = document.createElement("span");
      gif.className = "gif-icon";
      gif.textContent = "▶";
      post.appendChild(gif);
    }

    img.onclick = () => {
      postIndex = visiblePosts.indexOf(post);
      openPost();
    };

    gallery.appendChild(post);
    allPosts.push(post);
  });
}

// =======================
// VIEW FILTER
// =======================
function applyViewFromHash() {
  const hash = location.hash.replace("#", "");
  const view = hash === "anime" || hash === "western" ? hash : "main";
tabs.forEach(btn => {
  btn.classList.toggle(
    "active",
    view !== "main" && btn.dataset.tab === view
  );
});

  visiblePosts = allPosts.filter(p =>
    view === "main" ? p.dataset.main === "1" : p.dataset.tag === view
  );

  allPosts.forEach(p => {
    p.style.display = visiblePosts.includes(p) ? "" : "none";
  });
}

// =======================
// LIGHTBOX
// =======================
function openPost() {
  imgs = visiblePosts[postIndex].dataset.images.split(",");
  imgIndex = 0;
  updateImage();
  lb.classList.add("open");
  imgNav.style.display = imgs.length > 1 ? "flex" : "none";

}

function updateImage() {
  lbImg.src = imgs[imgIndex];
  counter.textContent = imgs.length > 1 ? `${imgIndex + 1} / ${imgs.length}` : "";
}

// =======================
// CONTROLS
// =======================
imgNext.onclick = () => {
  if (!canClick || imgs.length < 2) return;
  canClick = false;
  imgIndex = (imgIndex + 1) % imgs.length;
  updateImage();
  setTimeout(() => (canClick = true), 80);
};

imgPrev.onclick = () => {
  if (!canClick || imgs.length < 2) return;
  canClick = false;
  imgIndex = (imgIndex - 1 + imgs.length) % imgs.length;
  updateImage();
  setTimeout(() => (canClick = true), 80);
};

postNext.onclick = () => {
  postIndex = (postIndex + 1) % visiblePosts.length;
  openPost();
};

postPrev.onclick = () => {
  postIndex = (postIndex - 1 + visiblePosts.length) % visiblePosts.length;
  openPost();
};

closeBtn.onclick = () => lb.classList.remove("open");

lb.onclick = e => {
  if (e.target === lb) lb.classList.remove("open");
};

// =======================
// KEYBOARD
// =======================
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;

  if (e.key === "ArrowLeft") imgPrev.click();
  if (e.key === "ArrowRight") imgNext.click();
  if (e.key === "ArrowUp") postPrev.click();
  if (e.key === "ArrowDown") postNext.click();
  if (e.key === "Escape") lb.classList.remove("open");
});



