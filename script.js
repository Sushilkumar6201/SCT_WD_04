// script.js
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapSound = new Audio('lap-sound.mp3');

// Load saved settings on page load
window.onload = () => {
  const savedLaps = JSON.parse(localStorage.getItem("laps"));
  if (savedLaps) {
    savedLaps.forEach(lap => {
      appendLap(lap);
    });
  }
  const darkMode = localStorage.getItem("theme") === "dark";
  document.body.classList.toggle("dark", darkMode);
  document.body.classList.toggle("light", !darkMode);
  document.getElementById("themeSwitcher").checked = darkMode;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
};

function updateDisplay() {
  const currentTime = Date.now() - startTime + elapsedTime;
  const milliseconds = currentTime % 1000;
  const seconds = Math.floor((currentTime / 1000) % 60);
  const minutes = Math.floor((currentTime / 60000) % 60);
  const hours = Math.floor((currentTime / 3600000));

  document.getElementById('display').textContent =
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}.` +
    `${String(milliseconds).padStart(3, '0')}`;
}

function startTimer() {
  if (!isRunning) {
    startTime = Date.now();
    timerInterval = setInterval(updateDisplay, 10);
    isRunning = true;
  }
}

function pauseTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    elapsedTime += Date.now() - startTime;
    isRunning = false;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  document.getElementById('display').textContent = '00:00:00.000';
  document.getElementById('lapList').innerHTML = '';
  localStorage.removeItem("laps");
}

function recordLap() {
  if (!isRunning) return;
  const lapTime = document.getElementById('display').textContent;
  appendLap(lapTime);
  lapSound.play();

  let savedLaps = JSON.parse(localStorage.getItem("laps")) || [];
  savedLaps.push(lapTime);
  localStorage.setItem("laps", JSON.stringify(savedLaps));
}

function appendLap(lapTime) {
  const lapList = document.getElementById('lapList');
  const lapItem = document.createElement('li');
  lapItem.textContent = `Lap ${lapList.children.length + 1}: ${lapTime}`;
  lapList.appendChild(lapItem);
}

function exportLaps() {
  const lapItems = document.querySelectorAll('#lapList li');
  if (!lapItems.length) return alert("No laps to export!");

  const lapText = Array.from(lapItems).map(item => item.textContent).join('\n');
  const blob = new Blob([lapText], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'lap_times.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Theme switcher
document.getElementById("themeSwitcher").addEventListener("change", function () {
  const isDark = this.checked;
  document.body.classList.toggle("dark", isDark);
  document.body.classList.toggle("light", !isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
