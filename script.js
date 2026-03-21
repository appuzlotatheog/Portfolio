/* ===================================================
   APPUZLOTA PORTFOLIO — Script
   Pure JS + GSAP + ScrollTrigger
   =================================================== */

(function () {
  "use strict";

  // --- SYNC CONFIG (Edit this to nudge the vibe) ---
  const VIBE_CONFIG = {
    SYNC_OFFSET: 0.3, // Global nudge (negative = earlier, positive = later)
    SCROLL_SPEED: 0.5,  // Transition duration for scrolling
    LYRIC_INTERVAL: 2.9, // Default seconds between lines for the fast part
    BRIDGE_INTERVAL: 4.0 // Seconds between lines for the "Ready" part
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* -------------------------------------------------
     LOADER
     ------------------------------------------------- */
  function initLoader() {
    const loader = $("#loader"), bar = $("#loaderBar"), nav = $("#nav");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 5;
      if (progress > 100) progress = 100;
      bar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loader, { yPercent: -100, duration: 0.8, ease: "power4.inOut", onComplete: () => {
            loader.style.display = "none"; animateHeroEntrance(); nav.classList.add("visible");
          }});
        }, 400);
      }
    }, 80);
  }

  /* -------------------------------------------------
     HERO ENTRANCE
     ------------------------------------------------- */
  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    gsap.set(".hero-greeting, .hero-name, .hero-role-wrapper, .hero-desc, .hero-cta-group .btn", { opacity: 0 });
    gsap.set(".hero-card, .hero-arch-sticker, .hero-status-badge", { opacity: 0, scale: 0.5 });

    tl.to(".hero-greeting", { opacity: 1, x: 0, duration: 0.8 })
      .to(".hero-name", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
      .to(".hero-role-wrapper", { opacity: 1, scale: 1, duration: 0.6 }, "-=0.6")
      .to(".hero-desc", { opacity: 1, x: 0, duration: 0.6 }, "-=0.4")
      .fromTo(".hero-cta-group .btn", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, clearProps: "all" }, "-=0.3")
      .to(".hero-card, .hero-arch-sticker, .hero-status-badge", { opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.7)", clearProps: "scale" }, "-=0.5");
    tl.call(startTyping, null, "-=0.5");
  }

  /* -------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------- */
  function initScrollAnimations() {
    if (typeof ScrollTrigger === "undefined") return;
    $$(".anim-reveal").forEach((el) => {
      gsap.from(el, { scrollTrigger: { trigger: el, start: "top 90%", once: true, onEnter: () => el.classList.add("anim-active") }, opacity: 0, y: 50, rotate: 3, duration: 1, ease: "power3.out" });
    });
    $$(".tools-grid").forEach((grid) => {
      gsap.from($$(".tool-category", grid), { scrollTrigger: { trigger: grid, start: "top 80%", once: true }, opacity: 0, y: 60, scale: 0.9, stagger: 0.1, duration: 0.8, ease: "back.out(1.2)", clearProps: "all" });
    });
  }

  /* -------------------------------------------------
     TYPING EFFECT
     ------------------------------------------------- */
  function startTyping() {
    const roles = ["AI Prompting God", "Chaos Engineer", "Vibe Coder", "Sentience Seeker", "I use Arch btw", "Coffee Disposer"];
    const el = $("#heroRole"); if (!el) return;
    let rI = 0, cI = 0, isD = false, del = 100;
    function type() {
      const cur = roles[rI];
      if (!isD) { el.textContent = cur.substring(0, cI + 1); cI++; del = 70; if (cI === cur.length) { isD = true; del = 2000; } }
      else { el.textContent = cur.substring(0, cI - 1); cI--; del = 40; if (cI === 0) { isD = false; rI = (rI + 1) % roles.length; del = 500; } }
      setTimeout(type, del);
    }
    type();
  }

  /* -------------------------------------------------
     NAV & MENU
     ------------------------------------------------- */
  function initNav() {
    const nav = $("#nav"), mBtn = $("#menuBtn"), mMenu = $("#mobileMenu");
    let lastS = 0, isOpen = false;
    window.addEventListener("scroll", () => {
      if (isOpen) return;
      const cur = window.scrollY;
      if (cur < 50) { nav.classList.add("visible"); nav.classList.remove("nav-hidden"); }
      else if (cur > lastS && cur > 200) { nav.classList.remove("visible"); nav.classList.add("nav-hidden"); }
      else { nav.classList.add("visible"); nav.classList.remove("nav-hidden"); }
      lastS = cur;
    });
    if (mBtn && mMenu) {
      mBtn.addEventListener("click", () => {
        isOpen = mBtn.classList.toggle("open"); mMenu.classList.toggle("open");
        document.body.style.overflow = isOpen ? "hidden" : "";
        if (isOpen) {
          nav.classList.add("visible"); nav.classList.remove("nav-hidden");
          gsap.from(".mobile-link", { y: 50, opacity: 0, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)", delay: 0.2 });
        }
      });
    }
    $$('a[href^="#"]').forEach(l => {
      l.addEventListener("click", e => {
        const id = l.getAttribute("href"); if (id === "#") return;
        e.preventDefault(); const t = $(id);
        if (t) {
          isOpen = false; if(mBtn) mBtn.classList.remove("open"); if(mMenu) mMenu.classList.remove("open"); document.body.style.overflow = "";
          const y = t.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  }

  /* -------------------------------------------------
     ADVANCED MUSIC & LYRIC ENGINE
     ------------------------------------------------- */
  function initMusic() {
    const audio = $("#bgMusic"), toggle = $("#musicToggle"), icon = $("#musicIcon"), text = $(".music-text", toggle), lContainer = $("#lyricsContainer"), lList = $("#lyricsList"), pBar = $("#musicProgressBar");
    if (!audio || !toggle) return;

    const lyricsData = [
      { time: 0, text: "♪ Let It Happen..." },
      { time: 23, text: "I cannot vanish, you will not scare me" },
      { time: 25.9, text: "Try to get through it, try to push through it" },
      { time: 28.8, text: "You were not thinking that I will not do it" },
      { time: 31.7, text: "They be lovin' someone and I'm another story" },
      { time: 34.6, text: "Take the next ticket, get the next train" },
      { time: 37.5, text: "Why would I do it? Anyone'd think that" },
      { time: 40.4, text: "I cannot vanish, you will not scare me" },
      { time: 43.3, text: "Try to get through it, try to push through it" },
      { time: 46.2, text: "You were not thinking that I will not do it" },
      { time: 49.1, text: "They be lovin' someone and I'm another story" },
      { time: 52.0, text: "Take the next ticket, get the next train" },
      { time: 54.9, text: "Why would I do it? Anyone'd think that" },
      { time: 57.8, text: "Try to get through it, try to push through it" },
      { time: 60.7, text: "You were not thinking that I will not do it" },
      { time: 63.6, text: "They be lovin' someone and I'm another story" },
      { time: 66.5, text: "Take the next ticket, get the next train" },
      { time: 69.4, text: "Why would I do it? Anyone'd think that" },
      { time: 72.5, text: "Baby, now I'm ready, moving on" },
      { time: 76.5, text: "Oh, but maybe I was ready all along" },
      { time: 80.5, text: "Oh, I'm ready for the moment and the sound" },
      { time: 84.5, text: "Oh, but maybe I was ready all along" },
      { time: 88.5, text: "Baby, now I'm ready, moving on" },
      { time: 92.5, text: "Oh, but maybe I was ready all along" },
      { time: 96.5, text: "Oh, I'm ready for the moment and the sound" },
      { time: 100.5, text: "Oh, but maybe I was ready all along" }
    ];

    lList.innerHTML = lyricsData.map((l, i) => `<div class="lyric-line" data-index="${i}">${l.text}</div>`).join('');

    audio.volume = 0.4;

    toggle.addEventListener("click", () => {
      if (audio.paused) {
        text.textContent = "Syncing...";
        audio.play().then(() => {
          toggle.classList.add("playing"); lContainer.classList.add("visible");
          icon.className = "fa-solid fa-volume-high"; text.textContent = "Vibe: On";
        }).catch(e => { text.textContent = "Vibe Error"; setTimeout(() => { text.textContent = "Vibe: Off"; }, 2000); });
      } else {
        audio.pause(); toggle.classList.remove("playing"); lContainer.classList.remove("visible");
        icon.className = "fa-solid fa-volume-xmark"; text.textContent = "Vibe: Off";
      }
    });

    audio.addEventListener("timeupdate", () => {
      const curT = audio.currentTime + VIBE_CONFIG.SYNC_OFFSET;
      if (audio.duration) pBar.style.width = (audio.currentTime / audio.duration * 100) + "%";

      let activeIdx = -1;
      for (let i = 0; i < lyricsData.length; i++) {
        if (curT >= lyricsData[i].time) activeIdx = i;
        else break;
      }

      if (activeIdx !== -1) {
        const lines = $$(".lyric-line");
        lines.forEach((l, i) => {
          if (i === activeIdx) l.classList.add("active");
          else l.classList.remove("active");
        });

        // Frame-perfect centering
        const lineEl = lines[activeIdx];
        const scrollOffset = lineEl.offsetTop - 90; // Align to focus area
        lList.style.transform = `translateY(-${scrollOffset}px)`;
      }
    });
  }

  /* -------------------------------------------------
     INTERACTIONS
     ------------------------------------------------- */
  function initInteractions() {
    $$(".btn, .nav-logo, .nav-menu-btn, .music-toggle").forEach(b => {
      b.addEventListener("mousemove", e => {
        const { width: w, height: h, left: l, top: t } = b.getBoundingClientRect();
        const x = e.clientX - l - w / 2, y = e.clientY - t - h / 2;
        gsap.to(b, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
      });
      b.addEventListener("mouseleave", () => gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }));
    });
    const hS = $(".hero"), hCs = $$(".hero-card, .hero-arch-sticker, .hero-status-badge");
    if (hS && hCs.length) {
      hS.addEventListener("mousemove", e => {
        const { width: w, height: h, left: l, top: t } = hS.getBoundingClientRect();
        const x = (e.clientX - l) / w - 0.5, y = (e.clientY - t) / h - 0.5;
        hCs.forEach((c, i) => gsap.to(c, { x: x * (i + 1) * 20, y: y * (i + 1) * 20, rotate: x * 15, duration: 0.6, ease: "power2.out", overwrite: "auto" }));
      });
      hS.addEventListener("mouseleave", () => hCs.forEach((c, i) => gsap.to(c, { x: 0, y: 0, rotate: [-6, 4, -3, -15, 2][i] || 0, duration: 1, ease: "elastic.out(1, 0.5)" })));
    }
    $$(".stat-number[data-count]").forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({ trigger: el, start: "top 95%", once: true, onEnter: () => {
        gsap.to({ val: 0 }, { val: target, duration: 2, ease: "power4.out", onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); } });
      }});
    });
  }

  function init() { initLoader(); initNav(); initScrollAnimations(); initInteractions(); initMusic(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
