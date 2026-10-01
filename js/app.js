(() => {
  const topbar = document.getElementById("topbar");
  if (topbar) {
    const onScroll = () => {
      topbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Drag-to-scroll for Netflix-style rails (desktop + touch)
  document.querySelectorAll("[data-rail]").forEach((rail) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    rail.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a") && e.pointerType === "mouse") {
        // allow slight drag without killing click
      }
      isDown = true;
      startX = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
    });

    rail.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.2;
      if (Math.abs(walk) > 6) {
        rail.dataset.dragging = "1";
      }
      rail.scrollLeft = scrollLeft - walk;
    });

    const end = () => {
      isDown = false;
      setTimeout(() => {
        delete rail.dataset.dragging;
      }, 40);
    };

    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointercancel", end);

    rail.addEventListener("click", (e) => {
      if (rail.dataset.dragging === "1") {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });

  // Lesson player demo
  const player = document.getElementById("player");
  const playBtn = document.getElementById("playBtn");
  const overlay = document.getElementById("playerOverlay");
  const scrub = document.getElementById("scrub");
  const scrubFill = document.getElementById("scrubFill");
  const scrubThumb = document.getElementById("scrubThumb");
  const timeLabel = document.getElementById("timeLabel");

  let progress = 62;
  let playing = false;
  let timer = null;

  const totalSec = 20 * 60 + 15;

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const renderProgress = () => {
    if (!scrubFill) return;
    scrubFill.style.width = `${progress}%`;
    scrubThumb.style.left = `${progress}%`;
    scrub.setAttribute("aria-valuenow", String(Math.round(progress)));
    const current = (progress / 100) * totalSec;
    timeLabel.textContent = `${fmt(current)} / ${fmt(totalSec)}`;
  };

  if (playBtn && player) {
    playBtn.addEventListener("click", () => {
      playing = !playing;
      player.classList.toggle("is-playing", playing);
      if (overlay) overlay.hidden = !playing;

      if (playing) {
        timer = setInterval(() => {
          progress = Math.min(100, progress + 0.15);
          renderProgress();
          if (progress >= 100) {
            clearInterval(timer);
            playing = false;
            player.classList.remove("is-playing");
          }
        }, 200);
      } else if (timer) {
        clearInterval(timer);
      }
    });
  }

  if (scrub) {
    const setFromEvent = (e) => {
      const rect = scrub.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      progress = Math.max(0, Math.min(100, x * 100));
      renderProgress();
    };

    scrub.addEventListener("click", setFromEvent);
  }

  // Complete lesson
  const completeBtn = document.getElementById("completeBtn");
  const toast = document.getElementById("toast");

  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      completeBtn.classList.add("is-done");
      completeBtn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg> Aula concluída';

      const active = document.querySelector(".lesson-item.is-active");
      if (active) {
        active.classList.remove("is-active");
        active.classList.add("is-done");
        const status = active.querySelector(".li-status");
        if (status) status.textContent = "✓";
      }

      const locked = document.querySelector(".lesson-item.is-locked");
      if (locked) {
        locked.classList.remove("is-locked");
        const status = locked.querySelector(".li-status");
        if (status) status.textContent = "4";
        const small = locked.querySelector("small");
        if (small) small.textContent = "18 min · liberada";
      }

      if (toast) {
        toast.hidden = false;
        requestAnimationFrame(() => toast.classList.add("is-on"));
        setTimeout(() => {
          toast.classList.remove("is-on");
          setTimeout(() => {
            toast.hidden = true;
          }, 250);
        }, 2600);
      }
    });
  }
})();
