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
      bgMusic.volume = 1.0; // 100% (maximum)
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

  // Resume the music when the user comes back to the page
  function resumeMusic() {
    if (!musicStarted) return; // Never started (envelope not opened yet)
    try {
      bgMusic.volume = 1.0;
      bgMusic.loop = true;
      const p = bgMusic.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // If the browser blocks autoplay, retry on the next touch/click
          const retry = () => {
            bgMusic.play().catch(() => {});
          };
          document.addEventListener('pointerdown', retry, { once: true });
        });
      }
    } catch (e) {}
  }

  // Stop audio when the tab is hidden, resume when it becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAllAudio();
    } else {
      resumeMusic();
    }
  });

  // When the page is restored from the browser cache (back/forward buttons)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) resumeMusic();
  });

  // Stop audio when the page is closed / unloaded
  window.addEventListener('pagehide', stopAllAudio);
  window.addEventListener('beforeunload', stopAllAudio);

  // Also stop on bfcache restore edge cases
  window.addEventListener('unload', stopAllAudio);

  // ---------- Navigation ----------
  function goToPage(num) {
    if (isTransitioning || num === currentPage || !pages[num]) return;
    isTransitioning = true;

    playClick();

    // Hide current page
    pages[currentPage].classList.remove('active');

    // Show target page after a short delay for smoothness
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

    // After the flap opens, move to the next page
    setTimeout(() => {
      goToPage(2);
      // Quietly reset the envelope state in case of a revisit
      setTimeout(() => {
        envelope.classList.remove('open');
      }, 700);
    }, 1100);
  }

  envelope.addEventListener('click', openEnvelope);
  // The wrapper is also clickable to enlarge the tap area
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

    // Clean up after the animation ends
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

  // Make sure audio stops if the user navigates away via the browser back button
  window.addEventListener('popstate', stopAllAudio);

})();
