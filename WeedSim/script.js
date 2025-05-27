let jointsSmoked = 0;
let gramsSmoked = 0;
let ashProduced = 0;
let highLevel = 0;

const button = document.getElementById('inhale');
const status = document.getElementById('status');
const joint = document.getElementById('joint');
const smokeContainer = document.getElementById('smoke-container');
const inhaleSound = document.getElementById('inhale-sound');

const statsDisplay = document.getElementById('stats');
const highMeter = document.getElementById('high-meter');

function updateStats() {
  statsDisplay.innerHTML = `
    <p><strong>Joints Smoked:</strong> ${jointsSmoked}</p>
    <p><strong>Grams Smoked:</strong> ${gramsSmoked.toFixed(2)}g</p>
    <p><strong>Ash Produced:</strong> ${ashProduced.toFixed(1)}g</p>
  `;

  highMeter.style.width = `${Math.min(highLevel, 100)}%`;
}

button.addEventListener('click', () => {
  joint.style.transform = 'rotate(-5deg)';
  status.textContent = "Inhaling...";
  inhaleSound.currentTime = 0;
  inhaleSound.play();

  for (let i = 0; i < 5; i++) {
    const smoke = document.createElement('div');
    smoke.classList.add('smoke');
    smoke.style.left = `${Math.random() * 100 - 50}px`;
    smokeContainer.appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000);
  }

  // Update stats
  jointsSmoked += 1;
  let smokedGrams = Math.random() * 0.3 + 0.5; // 0.5–0.8g per joint
  gramsSmoked += smokedGrams;
  ashProduced += smokedGrams * 0.15;
  highLevel += Math.random() * 10 + 5; // increase highness

  setTimeout(() => {
    joint.style.transform = 'rotate(0)';
    status.textContent = "Feelin' good...";
    updateStats();
  }, 2000);
});

function startSimulator() {
  document.getElementById('story').style.display = 'none';
}

// Thought bubbles
const thoughts = [
  "Is this real life?",
  "Why do bytes taste like pizza?",
  "I'm the CPU of my destiny.",
  "Does RAM dream of electric sheep?",
  "Bro... the joint is coding me."
];

function showThought() {
  const thought = document.createElement('div');
  thought.className = 'thought';
  thought.textContent = thoughts[Math.floor(Math.random() * thoughts.length)];
  document.body.appendChild(thought);
  setTimeout(() => thought.remove(), 4000);
}

setInterval(() => {
  if (Math.random() < 0.3) showThought();
}, 8000);

// High milestone fun
function checkMilestones() {
  if (highLevel >= 100 && highLevel < 110) {
    alert("You've reached Level 100 Highness! Time slows down...");
  } else if (highLevel >= 200 && highLevel < 210) {
    alert("Level 200? You just unlocked Quantum Chill Mode.");
  }
}

// Konami code easter egg
let keySequence = [];
const konami = [38,38,40,40,37,39,37,39,66,65];

window.addEventListener('keydown', e => {
  keySequence.push(e.keyCode);
  if (keySequence.length > 10) keySequence.shift();
  if (keySequence.join(',') === konami.join(',')) {
    alert("Super High Mode Unlocked!");
    document.body.style.background = 'linear-gradient(45deg, #ff00cc, #3333ff)';
    highLevel = 420;
    updateStats();
  }
});

// Add this at the end of the inhale event:
setTimeout(() => {
  joint.style.transform = 'rotate(0)';
  status.textContent = "Feelin' good...";
  updateStats();
  checkMilestones();
}, 2000);

// Initial render
updateStats();