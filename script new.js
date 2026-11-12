/**
 * Happy Teacher's Day Interactive Card
 * Clean, structured, and production-ready
 */

(function () {
  'use strict';

  // ---------- DOM references ----------
  const pages = {
    1: document.getElementById('page1'),
    2: document.getElementById('page2'),
    3: document.getElementById('page3'),
    4: document.getElementById('page4'),
    5: document.getElementById('page5'),
  };

  const envelope = document.getElementById('envelope');
  const backBtn = document.getElementById('backBtn');
  const bgMusic = document.getElementById('bgMusic');
  const clickSfx = document.getElementById('clickSfx');
  const particlesContainer = document.getElementById('particles');

  // ---------- State ----------
  let currentPage = 1;
  let isTransitioning = false;
  let musicWanted = false; // true setelah pengunjung membuka amplop

  // ---------- Audio helpers ----------
  function playClick() {
    try {
      clickSfx.currentTime = 0;
      clickSfx.volume = 0.45;
      clickSfx.play().catch(() => {});
    } catch (e) {}
  }

  function startMusic() {
    musicWanted = true;
    try {
      bgMusic.volume = 1.0; // 100% (maksimal)
      bgMusic.loop = true;
      if (bgMusic.paused) bgMusic.play().catch(() => {});
    } catch (e) {}
  }

  // Lanjutkan musik; kalau diblokir browser, nyalakan di ketukan berikutnya
  function resumeMusic() {
    if (!musicWanted || !bgMusic.paused) return;
    bgMusic.play().catch(() => {
      const unlock = () => {
        if (musicWanted && bgMusic.paused) bgMusic.play().catch(() => {});
      };
      document.addEventListener('pointerdown', unlock, { once: true });
    });
  }

  // Pause (tanpa reset ke detik 0) saat keluar, lanjut saat kembali
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      bgMusic.pause();
    } else {
      resumeMusic();
    }
  });

  window.addEventListener('pagehide', () => bgMusic.pause());

  // Halaman dipulihkan dari cache (tombol back/forward)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) resumeMusic();
  });

  // ---------- Navigation ----------
  function goToPage(num) {
    if (isTransitioning || num === currentPage || !pages[num]) return;
    isTransitioning = true;

    playClick();

    // Hide current
    pages[currentPage].classList.remove('active');

    // Show target after short delay for smoothness
    setTimeout(() => {
      currentPage = num;
      pages[currentPage].classList.add('active');
      updateBackButton();
      isTransitioning = false;
    }, 280);
  }

  function updateBackButton() {
    if (currentPage > 1) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }

  // ---------- Envelope interaction ----------
  function openEnvelope() {
    if (envelope.classList.contains('open') || isTransitioning) return;

    playClick();
    startMusic();

    envelope.classList.add('open');

    // After flap opens, move to next page
    setTimeout(() => {
      goToPage(2);
      // Reset envelope state quietly for possible revisit
      setTimeout(() => {
        envelope.classList.remove('open');
      }, 700);
    }, 1100);
  }

  envelope.addEventListener('click', openEnvelope);
  // Juga bisa diklik dari wrapper agar area klik lebih luas
  const envelopeWrapper = document.querySelector('.envelope-wrapper');
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }

  // ---------- Next buttons ----------
  document.querySelectorAll('.next-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next, 10);
      if (next) goToPage(next);
    });
  });

  // ---------- Back button ----------
  backBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  // ---------- Floating particles ----------
  const emojis = ['💖', '✨', '🌟', '🍎', '📚', '🎓', '💕', '🌸', '⭐', '💛'];

  function createParticle() {
    if (!particlesContainer) return;
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (12 + Math.random() * 14) + 'px';
    el.style.animationDuration = (9 + Math.random() * 10) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    particlesContainer.appendChild(el);

    // Clean up after animation
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, 22000);
  }

  // Spawn particles periodically
  for (let i = 0; i < 10; i++) {
    setTimeout(createParticle, i * 500);
  }
  setInterval(createParticle, 1600);

  // ---------- Init ----------
  updateBackButton();

})();
