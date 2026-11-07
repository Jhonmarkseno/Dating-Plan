(function () {
  "use strict";

  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const card = document.getElementById("card");
  const tease = document.getElementById("tease");
  const overlay = document.getElementById("overlay");
  const mainEmoji = document.getElementById("mainEmoji");
  const againBtn = document.getElementById("againBtn");
  const introNext = document.getElementById("introNext");
  const planNext = document.getElementById("planNext");
  const planBack = document.getElementById("planBack");
  const choicesBack = document.getElementById("choicesBack");
  const confirmBtn = document.getElementById("confirmBtn");
  const confirmList = document.getElementById("confirmList");
  const saveBtn = document.getElementById("saveBtn");
  const editBtn = document.getElementById("editBtn");
  const confirmTitle = document.getElementById("confirmTitle");
  const pickSummary = document.getElementById("pickSummary");
  const pickProgress = document.getElementById("pickProgress");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");

  const steps = Array.from(document.querySelectorAll(".step"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const stepCount = document.getElementById("stepCount");
  const stepOrder = ["intro", "plan", "choices", "confirm"];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  overlay.inert = true;
  overlay.setAttribute("aria-hidden", "true");

  const starLayer = document.getElementById("stars");
  for (let i = 0; i < 70; i++) {
    const star = document.createElement("span");
    const size = 1 + Math.random() * 2.2;
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.setProperty("--dur", (2 + Math.random() * 4).toFixed(2) + "s");
    star.style.animationDelay = (-Math.random() * 6).toFixed(2) + "s";
    starLayer.appendChild(star);
  }

  const heartLayer = document.getElementById("hearts");
  const heartChars = ["💖", "💕", "❤️", "💘", "💗", "🩷"];
  for (let i = 0; i < 22; i++) {
    const span = document.createElement("span");
    span.className = "heart";
    span.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.fontSize = 16 + Math.random() * 26 + "px";
    span.style.animationDuration = 7 + Math.random() * 9 + "s";
    span.style.animationDelay = -Math.random() * 12 + "s";
    heartLayer.appendChild(span);
  }

  const snowLayer = document.getElementById("snow");
  const flakeChars = ["❄", "❅", "❆", "❄", "•"];
  for (let i = 0; i < 45; i++) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = flakeChars[Math.floor(Math.random() * flakeChars.length)];
    flake.style.left = Math.random() * 100 + "%";
    flake.style.fontSize = 6 + Math.random() * 16 + "px";
    flake.style.opacity = 0.35 + Math.random() * 0.55;
    flake.style.animationDuration = 8 + Math.random() * 12 + "s";
    flake.style.animationDelay = -Math.random() * 20 + "s";
    snowLayer.appendChild(flake);
  }

  const noTexts = [
    "No 😢", "Are you sure? 🥺", "Please? 🥹", "Just say yes 😭",
    "So unfair 💔", "Really no? 😳", "Try again 😌", "You can't catch me 😜",
    "Last chance 🥺", "Okay... yes then? 😅", "Sorry, I can't be clicked 😘"
  ];

  const teases = [
    "Whoa, \"No\" just ran away! 😱",
    "\"No\" is pretty fast, huh? 😏",
    "It already told you: the answer is YES 💖",
    "\"No\" is not available. Please choose YES. 🥰",
    "No matter what you do, YES is the right answer 😌",
    "It's just shy — go ahead and press YES 💕",
    "There's no \"No\" today, sorry 😅"
  ];

  let dodgeCount = 0;
  let escaped = false;
  let overlayOpen = false;
  let currentStep = "intro";

  function updateDots(name) {
    const index = stepOrder.indexOf(name);
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
      dot.classList.toggle("done", i < index);
    });
    if (stepCount) {
      stepCount.textContent = "Step " + (index + 1) + " of " + stepOrder.length;
    }
    if (againBtn) {
      againBtn.textContent = name === "intro" ? "Back to the question ↩️" : "Start over 🔁";
    }
  }

  function focusIn(step, selector) {
    const target = step.querySelector(selector) || step.querySelector(".chip, h2, h3, h4");
    if (target) target.focus({ preventScroll: true });
  }

  function goToStep(name, focusSelector, force) {
    if (!force && name === currentStep) return;
    const next = steps.find(function (step) {
      return step.dataset.step === name;
    });
    if (!next) return;

    steps.forEach(function (step) {
      if (step === next) return;
      if (step.classList.contains("active")) {
        step.classList.remove("active");
        step.classList.add("leaving");
        if (step._leaveTimer) window.clearTimeout(step._leaveTimer);
        const onEnd = function () {
          if (step._leaveTimer) {
            window.clearTimeout(step._leaveTimer);
            step._leaveTimer = null;
          }
          step.classList.remove("leaving");
          step.removeEventListener("animationend", onEnd);
        };
        step.addEventListener("animationend", onEnd);
        step._leaveTimer = window.setTimeout(onEnd, 480);
      } else {
        step.classList.remove("leaving");
      }
    });

    next.classList.remove("leaving");
    next.classList.add("active");
    next.classList.remove("entering");
    void next.offsetWidth;
    next.classList.add("entering");
    window.setTimeout(function () {
      next.classList.remove("entering");
    }, 900);

    currentStep = name;
    updateDots(name);
    overlay.scrollTop = 0;

    if (focusSelector) {
      window.setTimeout(function () {
        focusIn(next, focusSelector);
      }, 280);
    }
  }

  overlay.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!overlayOpen) return;
      e.preventDefault();
      againBtn.click();
      return;
    }

    if (e.key !== "Tab") return;

    const focusables = Array.from(
      overlay.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return el.offsetParent !== null && !el.closest(".leaving") && !el.closest("[inert]");
    });

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!overlay.contains(document.activeElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
      return;
    }

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  function overlapsYes(x, y, w, h, pad) {    const r = yesBtn.getBoundingClientRect();
    return !(x + w + pad < r.left || x - pad > r.right || y + h + pad < r.top || y - pad > r.bottom);
  }

  function dodge() {
    if (overlayOpen) return;

    if (!escaped) {
      const rect = noBtn.getBoundingClientRect();
      noBtn.classList.add("escaped");
      noBtn.style.left = rect.left + "px";
      noBtn.style.top = rect.top + "px";
      escaped = true;
    }

    dodgeCount++;
    const pad = 14;
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const maxX = Math.max(pad, window.innerWidth - w - pad);
    const maxY = Math.max(pad, window.innerHeight - h - pad);

    let x = pad;
    let y = pad;
    let tries = 0;
    do {
      x = pad + Math.random() * (maxX - pad);
      y = pad + Math.random() * (maxY - pad);
      tries++;
    } while (tries < 30 && overlapsYes(x, y, w, h, 26));

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";

    const scale = Math.max(0.45, 1 - dodgeCount * 0.045);
    noBtn.style.transform = "scale(" + scale + ")";
    noBtn.textContent = noTexts[Math.min(dodgeCount, noTexts.length - 1)];

    const yesScale = Math.min(1.7, 1 + dodgeCount * 0.05);
    yesBtn.style.transform = "scale(" + yesScale + ")";

    if (dodgeCount >= 2) {
      tease.textContent = teases[(dodgeCount - 2) % teases.length];
      tease.classList.add("show");
    }
    if (dodgeCount === 4) mainEmoji.textContent = "🥹";
    if (dodgeCount === 8) mainEmoji.textContent = "😤";
    if (dodgeCount >= 12) mainEmoji.textContent = "😌";
  }

  noBtn.addEventListener("mouseenter", dodge);
  noBtn.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    dodge();
  });
  noBtn.addEventListener("click", function (e) {
    e.preventDefault();
    dodge();
  });
  noBtn.addEventListener("focus", dodge);

  document.addEventListener("pointermove", function (e) {
    if (!escaped || overlayOpen) return;
    const r = noBtn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < 120) dodge();
  });

  window.addEventListener("resize", function () {
    if (!escaped) return;
    const pad = 14;
    let x = parseFloat(noBtn.style.left) || pad;
    let y = parseFloat(noBtn.style.top) || pad;
    x = Math.min(x, window.innerWidth - noBtn.offsetWidth - pad);
    y = Math.min(y, window.innerHeight - noBtn.offsetHeight - pad);
    noBtn.style.left = Math.max(pad, x) + "px";
    noBtn.style.top = Math.max(pad, y) + "px";
  });

  function addRipple(target, event) {
    if (reduceMotion) return;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = size + "px";
    ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    target.appendChild(ripple);
    window.setTimeout(function () {
      ripple.remove();
    }, 700);
  }

  document.querySelectorAll(".btn:not(#noBtn), .chip").forEach(function (target) {
    target.addEventListener("pointerdown", function (e) {
      addRipple(target, e);
    });
  });

  const pickSlots = {
    drink: document.querySelector('.pick-line[data-slot="drink"]'),
    food: document.querySelector('.pick-line[data-slot="food"]'),
    other: document.querySelector('.pick-line[data-slot="other"]'),
    activity: document.querySelector('.pick-line[data-slot="activity"]')
  };
  const picks = { drink: null, food: null, other: null, activity: null };
  const pickLabels = { drink: "Drink", food: "Food", other: "Treat", activity: "Activity" };
  const pickOrder = ["drink", "food", "activity", "other"];

  function updateConfirmState() {
    confirmBtn.disabled = !pickOrder.every(function (key) {
      return Boolean(picks[key]);
    });
  }

  function updateSummary() {
    const parts = [];
    let picked = 0;
    pickOrder.forEach(function (key) {
      if (picks[key]) {
        picked++;
        parts.push(pickLabels[key] + ": " + picks[key]);
      }
    });
    pickSummary.textContent = parts.length ? "Your picks — " + parts.join("  ·  ") : "";
    if (pickProgress) {
      const complete = picked === pickOrder.length;
      pickProgress.textContent = complete
        ? "All 4 picked — ready to lock it in 💝"
        : picked + " of " + pickOrder.length + " picked — " + (pickOrder.length - picked) + " more to go";
      pickProgress.classList.toggle("complete", complete);
    }
  }

  function resetPicks() {
    Object.keys(picks).forEach(function (key) {
      picks[key] = null;
    });
    document.querySelectorAll(".chip").forEach(function (chip) {
      chip.classList.remove("selected");
      chip.setAttribute("aria-pressed", "false");
    });
    Object.keys(pickSlots).forEach(function (key) {
      pickSlots[key].textContent = "";
      pickSlots[key].classList.remove("show");
    });
    pickSummary.textContent = "";
    if (pickProgress) {
      pickProgress.textContent = "0 of 4 picked — choose one from each category";
      pickProgress.classList.remove("complete");
    }
    updateConfirmState();
  }

  document.querySelectorAll(".choice-list").forEach(function (list) {
    const category = list.dataset.category;
    list.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const wasSelected = chip.classList.contains("selected");
        list.querySelectorAll(".chip").forEach(function (other) {
          other.classList.remove("selected");
          other.setAttribute("aria-pressed", "false");
        });

        if (wasSelected) {
          picks[category] = null;
          pickSlots[category].textContent = "";
          pickSlots[category].classList.remove("show");
        } else {
          chip.classList.add("selected");
          chip.setAttribute("aria-pressed", "true");
          const choice = chip.dataset.value + " " + chip.dataset.emoji;
          picks[category] = choice;
          pickSlots[category].textContent = "Your pick: " + choice;
          pickSlots[category].classList.add("show");
        }

        updateSummary();
        updateConfirmState();
      });
    });
  });

  yesBtn.addEventListener("click", function () {
    if (overlayOpen) return;
    overlayOpen = true;
    card.inert = true;
    overlay.inert = false;
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("show");
    overlay.scrollTop = 0;
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.9)";
    noBtn.style.display = "none";
    startConfetti();
    goToStep("intro", "#yesTitle", true);
  });

  introNext.addEventListener("click", function () {
    stopConfetti();
    goToStep("plan", "#planTitle");
  });

  planNext.addEventListener("click", function () {
    goToStep("choices", ".chip");
  });

  planBack.addEventListener("click", function () {
    goToStep("intro", "#yesTitle");
  });

  choicesBack.addEventListener("click", function () {
    goToStep("plan", "#planTitle");
  });

  function openConfirm() {
    if (confirmBtn.disabled) return;
    confirmList.innerHTML = "";
    pickOrder.forEach(function (key) {
      if (!picks[key]) return;
      const li = document.createElement("li");
      const label = document.createElement("span");
      label.className = "confirm-key";
      label.textContent = pickLabels[key];
      const value = document.createElement("span");
      value.className = "confirm-value";
      value.textContent = picks[key];
      li.appendChild(label);
      li.appendChild(value);
      confirmList.appendChild(li);
    });
    startConfetti();
    goToStep("confirm", "#confirmTitle");
  }

  confirmBtn.addEventListener("click", openConfirm);

  editBtn.addEventListener("click", function () {
    stopConfetti();
    goToStep("choices", ".chip.selected");
  });

  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
      toastTimer = null;
    }, 2400);
  }

  function legacyCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.style.pointerEvents = "none";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (error) {
      ok = false;
    }
    area.remove();
    return ok;
  }

  function copyText(text, onSuccess, onFailure) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess, function () {
        if (legacyCopy(text)) onSuccess();
        else onFailure();
      });
    } else if (legacyCopy(text)) {
      onSuccess();
    } else {
      onFailure();
    }
  }

  function buildPlanText() {
    const lines = [
      "Our Christmas Date Plan 🎄",
      "",
      "4:00 PM — Cozy café time" + (picks.drink ? " (" + picks.drink + ")" : ""),
      "5:30 PM — Stroll through the Christmas lights" + (picks.activity ? " (" + picks.activity + ")" : ""),
      "7:00 PM — Noche Buena-style dinner for two" + (picks.food ? " (" + picks.food + ")" : ""),
      "8:30 PM — Dessert, gifts & stargazing" + (picks.other ? " (" + picks.other + ")" : ""),
      "",
      "Dress code: cozy & festive 🧣🎄",
      "",
      "Made with love 💌"
    ];
    return lines.join("\n");
  }

  saveBtn.addEventListener("click", function () {
    const blob = new Blob([buildPlanText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "our-christmas-date-plan.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
    showToast("Plan downloaded 💌");
  });

  copyBtn.addEventListener("click", function () {
    copyText(
      buildPlanText(),
      function () {
        showToast("Plan copied — send it to me? 😉");
      },
      function () {
        showToast("Couldn't copy — try Save instead");
      }
    );
  });

  againBtn.addEventListener("click", function () {
    overlay.classList.remove("show");
    overlayOpen = false;
    overlay.setAttribute("aria-hidden", "true");
    overlay.inert = true;
    card.inert = false;
    card.style.opacity = "1";
    card.style.transform = "scale(1)";
    noBtn.style.display = "";
    noBtn.classList.remove("escaped");
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.transform = "";
    yesBtn.style.transform = "";
    noBtn.textContent = noTexts[0];
    mainEmoji.textContent = "🥺";
    tease.classList.remove("show");
    tease.textContent = "";
    dodgeCount = 0;
    escaped = false;
    resetPicks();
    steps.forEach(function (step) {
      step.classList.remove("active", "entering", "leaving");
    });
    const introStep = steps.find(function (step) {
      return step.dataset.step === "intro";
    });
    if (introStep) introStep.classList.add("active");
    currentStep = "intro";
    updateDots("intro");
    overlay.scrollTop = 0;
    stopConfetti();
    yesBtn.focus({ preventScroll: true });
  });

  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let rafId = null;
  let spawnTimer = null;
  const colors = ["#e63946", "#2a9d8f", "#ffd166", "#ffffff", "#d62828", "#43aa8b", "#f4a261"];

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function spawn(n) {
    for (let i = 0; i < n; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4,
        y: canvas.height * (0.45 + Math.random() * 0.2),
        vx: (Math.random() - 0.5) * 16,
        vy: -6 - Math.random() * 16,
        g: 0.32,
        size: 6 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        life: 1,
        decay: 0.006 + Math.random() * 0.006,
        shape: Math.random() < 0.25 ? "circle" : "rect"
      });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += p.g;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > canvas.height + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }
    rafId = requestAnimationFrame(loop);
  }

  function startConfetti() {
    if (reduceMotion) return;
    stopConfetti();
    spawn(90);
    spawnTimer = setInterval(function () {
      spawn(10);
    }, 260);
    loop();
    window.setTimeout(function () {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }, 2600);
  }

  function stopConfetti() {
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  updateDots("intro");
})();
