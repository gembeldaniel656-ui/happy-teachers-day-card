🙏/**
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
  let musicStarted = false;
  let isTransitioning = false;

  // ---------- Audio helpers ----------
  function playClick() {
    try {
      clickSfx.currentTime = 0;
      clickSfx.volume = 0.45;
      clickSfx.play().catch(() => {});
    } catch (e) {}
  }

  function startMusic() {
    if (musicStarted) return;
    try {
      bgMusic.volume = 0.100; // soft, non-intrusive
      bgMusic.loop = true;
      bgMusic.play()
        .then(() => { musicStarted = true; })
        .catch(() => {});
    } catch (e) {}
  }

  function stopAllAudio() {
    try {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      clickSfx.pause();
      clickSfx.currentTime = 0;
    } catch (e) {}
  }

  // Stop audio when tab is closed / hidden / unloaded
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAllAudio();
    }
  });

  window.addEventListener('pagehide', stopAllAudio);
  window.addEventListener('beforeunload', stopAllAudio);

  // Also stop on bfcache restore edge cases
  window.addEventListener('unload', stopAllAudio);

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
  envelope.addEventListener('click', () => {
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
  });

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
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = 12 + Math.random() * 14 + 'px';
    el.style.animationDuration = 8 + Math.random() * 12 + 's';
    el.style.animationDelay = Math.random() * 4 + 's';
    particlesContainer.appendChild(el);

    // Clean up after animation
    setTimeout(() => {
      el.remove();
    }, 20000);
  }

  // Spawn particles periodically
  for (let i = 0; i < 12; i++) {
    setTimeout(createParticle, i * 600);
  }
  setInterval(createParticle, 1800);

  // ---------- Init ----------
  updateBackButton();

  // Ensure audio stops if user navigates away via browser back
  window.addEventListener('popstate', stopAllAudio);

})();
