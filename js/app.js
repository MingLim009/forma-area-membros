(() => {
  const player = document.getElementById("player");
  const playBtn = document.getElementById("playBtn");
  const overlay = document.getElementById("playerOverlay");
  const scrub = document.getElementById("scrub");
  const scrubFill = document.getElementById("scrubFill");
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
    scrub?.setAttribute("aria-valuenow", String(Math.round(progress)));
    if (timeLabel) {
      timeLabel.textContent = `${fmt((progress / 100) * totalSec)} / ${fmt(totalSec)}`;
    }
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
    scrub.addEventListener("click", (e) => {
      const rect = scrub.getBoundingClientRect();
      progress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      renderProgress();
    });
  }

  const completeBtn = document.getElementById("completeBtn");
  const toast = document.getElementById("toast");

  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      completeBtn.classList.add("is-done");
      completeBtn.textContent = "Aula concluída";

      const active = document.querySelector(".lesson-list .is-active");
      if (active) {
        active.classList.remove("is-active");
        active.classList.add("is-done");
        const mark = active.querySelector("span");
        if (mark) mark.textContent = "✓";
      }

      const locked = document.querySelector(".lesson-list .is-locked");
      if (locked) {
        locked.classList.remove("is-locked");
        const mark = locked.querySelector("span");
        if (mark) mark.textContent = "4";
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
        }, 2200);
      }
    });
  }
})();
