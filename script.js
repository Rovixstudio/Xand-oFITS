let steps = 0;
let lastStepTime = 0;
let stepHistory = [];

const el = id => document.getElementById(id);

function updateUI() {
  el("steps").innerText = steps;
  el("distance").innerText = (steps * 0.0008).toFixed(2);
  el("calories").innerText = (steps * 0.04).toFixed(1);
  const now = Date.now();
  stepHistory = stepHistory.filter(t => now - t < 60000);
  el("spm").innerText = stepHistory.length;
}

function detectStep(accel) {
  const magnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
  const threshold = 12;
  const now = Date.now();
  if (magnitude > threshold && now - lastStepTime > 400) {
    steps++;
    stepHistory.push(now);
    lastStepTime = now;
    updateUI();
  }
}

function initMotion() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().then(response => {
      if (response === "granted") {
        window.addEventListener("devicemotion", e => {
          detectStep(e.accelerationIncludingGravity);
        });
        el("enableMotion").style.display = "none";
      }
    }).catch(console.error);
  } else {
    window.addEventListener("devicemotion", e => {
      detectStep(e.accelerationIncludingGravity);
    });
    el("enableMotion").style.display = "none";
  }
}

el("enableMotion").addEventListener("click", initMotion);
