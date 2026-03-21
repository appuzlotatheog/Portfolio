/* ===================================================
   APPUZLOTA PORTFOLIO — Script
   Pure JS + GSAP + ScrollTrigger
   =================================================== */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Register ScrollTrigger early
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* -------------------------------------------------
     LOADER
     ------------------------------------------------- */
  function initLoader() {
    const loader = $("#loader");
    const bar = $("#loaderBar");
    const nav = $("#nav");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 5;
      if (progress > 100) progress = 100;
      bar.style.width = progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(loader, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
              loader.style.display = "none";
              animateHeroEntrance();
              nav.classList.add("visible");
            },
          });
        }, 400);
      }
    }, 100);
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
      .fromTo(".hero-cta-group .btn", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, clearProps: "opacity,transform" }, 
        "-=0.3"
      )
      .to(".hero-card, .hero-arch-sticker, .hero-status-badge", { 
        opacity: 1, 
        scale: 1, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        clearProps: "scale"
      }, "-=0.5");

    tl.call(startTyping, null, "-=0.5");
  }

  /* -------------------------------------------------
     SCROLL REVEAL ANIMATIONS
     ------------------------------------------------- */
  function initScrollAnimations() {
    if (typeof ScrollTrigger === "undefined") return;

    $$(".anim-reveal").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => el.classList.add("anim-active"),
        },
        opacity: 0,
        y: 50,
        rotate: 3,
        duration: 1,
        ease: "power3.out"
      });
    });

    $$(".tools-grid").forEach((grid) => {
      const cards = $$(".tool-category", grid);
      gsap.from(cards, {
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 60,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.2)",
        clearProps: "all"
      });
    });
  }

  /* -------------------------------------------------
     TYPING EFFECT
     ------------------------------------------------- */
  function startTyping() {
    const roles = [
      "AI Prompting God",
      "Chaos Engineer",
      "Vibe Coder",
      "Sentience Seeker",
      "I use Arch btw",
      "Coffee Disposer",
    ];
    const el = $("#heroRole");
    if (!el) return;
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function type() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        delay = 70;

        if (charIndex === current.length) {
          isDeleting = true;
          delay = 2000;
        }
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        delay = 40;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          delay = 500;
        }
      }

      setTimeout(type, delay);
    }

    type();
  }

  /* -------------------------------------------------
     NAV & MOBILE MENU
     ------------------------------------------------- */
  function initNav() {
    const nav = $("#nav");
    const menuBtn = $("#menuBtn");
    const mobileMenu = $("#mobileMenu");
    let lastScroll = 0;
    let isMenuOpen = false;

    window.addEventListener("scroll", () => {
      if (isMenuOpen) return;
      const currentScroll = window.scrollY;
      if (currentScroll < 50) {
        nav.classList.add("visible");
        nav.classList.remove("nav-hidden");
      } else if (currentScroll > lastScroll && currentScroll > 200) {
        nav.classList.remove("visible");
        nav.classList.add("nav-hidden");
      } else {
        nav.classList.add("visible");
        nav.classList.remove("nav-hidden");
      }
      lastScroll = currentScroll;
    });

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        isMenuOpen = menuBtn.classList.toggle("open");
        mobileMenu.classList.toggle("open");
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        
        if (isMenuOpen) {
          nav.classList.add("visible");
          nav.classList.remove("nav-hidden");
          gsap.from(".mobile-link", {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: 0.2
          });
        }
      });
    }

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;
        e.preventDefault();
        const target = $(targetId);
        if (target) {
          isMenuOpen = false;
          if(menuBtn) menuBtn.classList.remove("open");
          if(mobileMenu) mobileMenu.classList.remove("open");
          document.body.style.overflow = "";
          const offset = 80;
          const y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  }

  /* -------------------------------------------------
     MUSIC & LYRICS
     ------------------------------------------------- */
  function initMusic() {
    const audio = $("#bgMusic");
    const toggle = $("#musicToggle");
    const icon = $("#musicIcon");
    const text = $(".music-text", toggle);
    const lyricsContainer = $("#lyricsContainer");
    const lyricText = $("#lyricText");
    const progressBar = $("#musicProgressBar");

    if (!audio || !toggle) return;

    const lyricsData = [
      { time: 0, text: "♪ Waiting for the drop..." },
      { time: 23, text: "I cannot vanish, you will not scare me" },
      { time: 25, text: "Try to get through it, try to push through it" },
      { time: 27, text: "You were not thinking that I will not do it" },
      { time: 29, text: "They be lovin' someone and I'm another story" },
      { time: 31, text: "Take the next ticket, get the next train" },
      { time: 33, text: "Why would I do it? Anyone'd think that" },
      { time: 35, text: "I cannot vanish, you will not scare me" },
      { time: 37, text: "Try to get through it, try to push through it" },
      { time: 39, text: "You were not thinking that I will not do it" },
      { time: 41, text: "They be lovin' someone and I'm another story" },
      { time: 43, text: "Take the next ticket, get the next train" },
      { time: 45, text: "Why would I do it? Anyone'd think that" },
      { time: 47, text: "Try to get through it, try to push through it" },
      { time: 49, text: "You were not thinking that I will not do it" },
      { time: 51, text: "They be lovin' someone and I'm another story" },
      { time: 53, text: "Take the next ticket, get the next train" },
      { time: 55, text: "Why would I do it? Anyone'd think that" },
      { time: 58, text: "Baby, now I'm ready, moving on" },
      { time: 62, text: "Oh, but maybe I was ready all along" },
      { time: 66, text: "Oh, I'm ready for the moment and the sound" },
      { time: 70, text: "Oh, but maybe I was ready all along" },
      { time: 74, text: "Baby, now I'm ready, moving on" },
      { time: 78, text: "Oh, but maybe I was ready all along" },
      { time: 82, text: "Oh, I'm ready for the moment and the sound" },
      { time: 86, text: "Oh, but maybe I was ready all along" }
    ];

    audio.volume = 0.4;

    toggle.addEventListener("click", () => {
      if (audio.paused) {
        text.textContent = "Loading...";
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            toggle.classList.add("playing");
            lyricsContainer.classList.add("visible");
            icon.className = "fa-solid fa-volume-high";
            text.textContent = "Vibe: On";
          }).catch(error => {
            console.error("Audio playback failed:", error);
            text.textContent = "Vibe Error";
            setTimeout(() => { text.textContent = "Vibe: Off"; }, 2000);
          });
        }
      } else {
        audio.pause();
        toggle.classList.remove("playing");
        lyricsContainer.classList.remove("visible");
        icon.className = "fa-solid fa-volume-xmark";
        text.textContent = "Vibe: Off";
      }
    });

    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      
      // Update progress bar
      if (duration) {
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = progress + "%";
      }

      // Sync lyrics
      const currentLyric = lyricsData
        .filter(l => l.time <= currentTime)
        .pop();

      if (currentLyric && lyricText.textContent !== currentLyric.text) {
        gsap.fromTo(lyricText, 
          { opacity: 0, y: 10, skewX: 10 }, 
          { opacity: 1, y: 0, skewX: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
        lyricText.textContent = currentLyric.text;
      }
    });
  }

  /* -------------------------------------------------
     INTERACTIONS
     ------------------------------------------------- */
  function initInteractions() {
    $$(".btn, .nav-logo, .nav-menu-btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const { width, height, left, top } = btn.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      });
    });

    const heroSection = $(".hero");
    const cards = $$(".hero-card, .hero-arch-sticker, .hero-status-badge");
    if (heroSection && cards.length) {
      heroSection.addEventListener("mousemove", (e) => {
        const { width, height, left, top } = heroSection.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        cards.forEach((card, i) => {
          const factor = (i + 1) * 20;
          gsap.to(card, { x: x * factor, y: y * factor, rotate: (x * 15), duration: 0.6, ease: "power2.out", overwrite: "auto" });
        });
      });
      heroSection.addEventListener("mouseleave", () => {
        cards.forEach((card, i) => {
          const rots = [-6, 4, -3, -15, 2];
          gsap.to(card, { x: 0, y: 0, rotate: rots[i] || 0, duration: 1, ease: "elastic.out(1, 0.5)" });
        });
      });
    }

    $$(".stat-number[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: "power4.out",
            onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); }
          });
        }
      });
    });
  }

  /* -------------------------------------------------
     INIT
     ------------------------------------------------- */
  function init() {
    initLoader();
    initNav();
    initScrollAnimations();
    initInteractions();
    initMusic();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
