"use strict";
(() => {
  const config = window.MAIMAI_SEAGULL;
  const canvas = document.querySelector("#pet");
  const context = canvas.getContext("2d");
  const stage = document.querySelector("#stage");
  const caption = document.querySelector("#caption");
  const label = document.querySelector("#scene-label");
  const message = document.querySelector("#load-message");
  const pause = document.querySelector("#pause");
  const reduced = document.querySelector("#reduced-motion");
  const autoPeek = document.querySelector("#auto-peek");
  const clips = new Map((config?.clips || []).map(clip => [clip.id, clip]));
  const descriptions = {
    peek: "海鸥慢慢靠近。麦麦已经看见了，只是还没拆穿。",
    celebrate: "任务完成！海鸥也完成了它的任务：顺走一根薯条。",
    caught: "嘴里还叼着呢。这次就放过你。",
    share: "这根给你，不用偷。两只一起歇一会儿。"
  };
  const atlas = new Image();
  const ordinary = new Image();
  let ready = false, selected = "peek", current = null, frame = 0;
  let elapsed = 0, previous = null, paused = false, completed = false;
  let autoTimer = null, animationRequest = null, savedPaused = false;
  const completedTaskIds = new Set();
  const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
  reduced.checked = mediaQuery.matches;
  context.imageSmoothingEnabled = false;

  function load(image, path) {
    return new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("动画素材没能加载。请重新打开项目中的预览页。"));
      image.src = path;
    });
  }
  function draw() {
    if (!ready) return;
    context.clearRect(0, 0, 192, 208);
    const row = current ? current.row : 0;
    const column = current ? frame : (reduced.checked ? 0 : frame % 6);
    context.drawImage(current ? atlas : ordinary, column * 192, row * 208, 192, 208, 0, 0, 192, 208);
    canvas.setAttribute("aria-label", current ? current.title : "麦麦平静地等待，轻轻眨眼");
    canvas.dataset.clip = current ? current.id : "idle";
    canvas.dataset.frame = String(column);
    canvas.dataset.completed = String(completed);
  }
  function updatePause() {
    pause.textContent = paused ? "继续" : "暂停";
    pause.setAttribute("aria-pressed", String(paused));
    pause.disabled = !ready || reduced.checked || completed;
  }
  function schedulePeek() {
    clearTimeout(autoTimer);
    autoTimer = null;
    if (!ready || !autoPeek.checked || reduced.checked || document.hidden || current || paused) return;
    autoTimer = setTimeout(() => play("peek"), 45000 + Math.random() * 15000);
  }
  function stopFrameLoop() {
    if (animationRequest !== null) cancelAnimationFrame(animationRequest);
    animationRequest = null;
    previous = null;
  }
  function startFrameLoop() {
    stopFrameLoop();
    if (ready && !reduced.checked && !paused && !completed && !document.hidden) {
      animationRequest = requestAnimationFrame(tick);
    }
  }
  function showIdle() {
    current = null;
    frame = 0;
    completed = false;
    elapsed = 0;
    label.textContent = "麦麦正在等你";
    document.querySelectorAll("button[data-clip]").forEach(button => button.setAttribute("aria-pressed", "false"));
    draw();
    updatePause();
    schedulePeek();
    startFrameLoop();
  }
  function play(id) {
    if (!ready || !clips.has(id)) return false;
    clearTimeout(autoTimer);
    autoTimer = null;
    selected = id;
    current = clips.get(id);
    completed = false;
    paused = false;
    frame = reduced.checked ? current.poster : 0;
    elapsed = 0;
    label.textContent = current.title;
    caption.textContent = descriptions[id] + (reduced.checked ? "（静态关键帧）" : "");
    document.querySelectorAll("button[data-clip]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.clip === id)));
    draw();
    updatePause();
    startFrameLoop();
    return true;
  }
  function tick(now) {
    animationRequest = null;
    if (previous !== null) elapsed += Math.min(now - previous, 100);
    previous = now;
    const durations = current ? current.durations : [280, 110, 110, 140, 140, 320];
    while (elapsed >= durations[frame]) {
      elapsed -= durations[frame];
      if (frame < durations.length - 1) frame += 1;
      else if (current) {
        completed = true;
        break;
      } else frame = 0;
    }
    draw();
    if (completed) {
      updatePause();
      // Keep the payoff visible. Automatic mode returns to ordinary idle once.
      if (autoPeek.checked && !document.hidden) autoTimer = setTimeout(showIdle, 1800);
    } else if (!paused && !reduced.checked && !document.hidden) animationRequest = requestAnimationFrame(tick);
  }

  document.querySelectorAll("button[data-clip]").forEach(button => button.addEventListener("click", () => play(button.dataset.clip)));
  document.querySelector("#replay").addEventListener("click", () => play(selected));
  pause.addEventListener("click", () => {
    paused = !paused;
    updatePause();
    startFrameLoop();
    if (paused) clearTimeout(autoTimer);
    else schedulePeek();
  });
  document.querySelector("#small-size").addEventListener("change", event => stage.classList.toggle("actual", event.target.checked));
  reduced.addEventListener("change", () => {
    clearTimeout(autoTimer);
    if (current) play(current.id);
    else showIdle();
  });
  mediaQuery.addEventListener("change", event => {
    reduced.checked = event.matches;
    reduced.dispatchEvent(new Event("change"));
  });
  autoPeek.addEventListener("change", () => {
    clearTimeout(autoTimer);
    if (autoPeek.checked) showIdle();
  });
  document.addEventListener("visibilitychange", () => {
    clearTimeout(autoTimer);
    if (document.hidden) {
      savedPaused = paused;
      stopFrameLoop();
    } else {
      paused = savedPaused;
      startFrameLoop();
      schedulePeek();
      if (completed && autoPeek.checked) autoTimer = setTimeout(showIdle, 1800);
    }
  });
  // Local extension hook only. No Codex task-event connection is claimed.
  function taskComplete(taskId) {
    if (!ready || typeof taskId !== "string" || !taskId.trim() || completedTaskIds.has(taskId)) return false;
    completedTaskIds.add(taskId);
    if (completedTaskIds.size > 128) completedTaskIds.delete(completedTaskIds.values().next().value);
    return play("celebrate");
  }
  let demoCounter = 0;
  document.querySelector("#task-complete").addEventListener("click", () => taskComplete(`demo-${++demoCounter}`));
  window.maimaiSeagull = Object.freeze({play, taskComplete, rest: () => play("share"), idle: showIdle});

  if (!config || clips.size !== 4) {
    message.textContent = "动作清单未加载，请从完整项目目录打开预览页。";
    stage.setAttribute("aria-busy", "false");
    return;
  }
  Promise.all([
    load(atlas, "../pet/extras/seagull/atlas.webp"),
    load(ordinary, "../pet/spritesheet.webp")
  ]).then(() => {
    ready = true;
    message.hidden = true;
    stage.setAttribute("aria-busy", "false");
    document.querySelectorAll("button").forEach(button => button.disabled = false);
    showIdle();
  }).catch(error => {
    message.textContent = error.message;
    stage.setAttribute("aria-busy", "false");
  });
})();
