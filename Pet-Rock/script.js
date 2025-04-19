let hunger = 50;
let fun = 50;
let energy = 50;
let alive = true;

function updateStats() {
  document.getElementById("hunger").textContent = hunger;
  document.getElementById("fun").textContent = fun;
  document.getElementById("energy").textContent = energy;
  checkIfDead();
}

function feedRock() {
  if (!alive) return;
  hunger = Math.max(0, hunger - 10);
  energy = Math.max(0, energy - 5);
  fun = Math.max(0, fun - 2);
  updateStats();
}

function playWithRock() {
  if (!alive) return;
  fun = Math.min(100, fun + 10);
  energy = Math.max(0, energy - 10);
  hunger = Math.min(100, hunger + 5);
  updateStats();
}

function restRock() {
  if (!alive) return;
  energy = Math.min(100, energy + 15);
  hunger = Math.min(100, hunger + 5);
  fun = Math.max(0, fun - 5);
  updateStats();
}

function checkIfDead() {
  if (hunger === 0 && fun === 0 && energy === 0) {
    alive = false;
    document.getElementById("message").textContent = "💀 Your pet rock has died.";
    document.getElementById("pet-rock").style.filter = "grayscale(100%) brightness(50%)";
    disableButtons();
  }
}

function disableButtons() {
  document.getElementById("feedBtn").disabled = true;
  document.getElementById("playBtn").disabled = true;
  document.getElementById("restBtn").disabled = true;
  document.getElementById("openMinigameBtn").disabled = true;
  document.getElementById("collectFunBtn").disabled = true;
}

function openMinigame() {
  window.open("clicker.html", "_blank");
}

function collectFun() {
  const earnedFun = parseInt(localStorage.getItem("funPoints") || "0", 10);
  if (earnedFun > 0 && alive) {
    fun = Math.min(100, fun + earnedFun);
    localStorage.setItem("funPoints", "0");
    updateStats();
    alert(`You gained ${earnedFun} fun from the minigame! 🎉`);
  } else {
    alert("No fun points to collect yet! Play a minigame first 🎮");
  }
}

function showLore() {
  document.getElementById("lore").style.display = "block";
}

function hideLore() {
  document.getElementById("lore").style.display = "none";
}

// Start stats update cycle
setInterval(() => {
  if (!alive) return;
  hunger = Math.min(100, hunger + 1);
  fun = Math.max(0, fun - 1);
  energy = Math.max(0, energy - 1);
  updateStats();
}, 3000);

updateStats();

let strength = 0; // New stat to track Rocknar's training level
let isTrained = false; // Whether Rocknar is trained enough to fight

function updateStats() {
  document.getElementById("hunger").textContent = hunger;
  document.getElementById("fun").textContent = fun;
  document.getElementById("energy").textContent = energy;
  checkIfDead();
}

function trainRock() {
  if (!alive) return;

  // Open training minigame in a new tab or window
  window.open("training.html", "_blank");
}

function collectTrainingPoints(points) {
  strength += points; // Increase strength from the training game
  alert(`Training complete! You gained ${points} strength!`);

  if (strength >= 100) {
    isTrained = true;
    document.getElementById("fightBtn").disabled = false; // Enable the fight button
    alert("Rocknar is now trained enough to fight the Coal Lord!");
  }
}

function fightCoalLord() {
  if (!alive) return;

  if (strength < 100) {
    alert("Rocknar is not yet strong enough to fight the Coal Lord.");
    return;
  }

  const battleOutcome = Math.random() * 100; // Simulate a battle outcome based on strength

  if (battleOutcome < strength) {
    winBattle();
  } else {
    loseBattle();
  }
}

function winBattle() {
  const fateChoice = prompt("Rocknar wins! Now, what will he do? Choose: \n1: Become the new ruler of the realm\n2: Retire peacefully with Selene\n3: Wander the world seeking wisdom");

  switch (fateChoice) {
    case "1":
      alert("Rocknar becomes the new ruler of the realm, forging a new empire of stone!");
      break;
    case "2":
      alert("Rocknar retires with Selene, building a quiet life in the Amethyst Forest.");
      break;
    case "3":
      alert("Rocknar journeys through the realms, seeking knowledge and wisdom beyond what any stone could dream.");
      break;
    default:
      alert("Rocknar chooses his own path, the world is his to shape!");
  }
}

function loseBattle() {
  alert("Rocknar falls in battle... The Coal Lord's power is too great. He must train again.");
  strength = 0;
  isTrained = false;
  document.getElementById("fightBtn").disabled = true; // Disable the fight button
  updateStats();
}

function checkIfDead() {
  if (hunger === 0 && fun === 0 && energy === 0) {
    alive = false;
    document.getElementById("message").textContent = "💀 Your pet rock has died.";
    document.getElementById("pet-rock").style.filter = "grayscale(100%) brightness(50%)";
    disableButtons();
  }
}

function disableButtons() {
  document.getElementById("feedBtn").disabled = true;
  document.getElementById("playBtn").disabled = true;
  document.getElementById("restBtn").disabled = true;
  document.getElementById("openMinigameBtn").disabled = true;
  document.getElementById("collectFunBtn").disabled = true;
  document.getElementById("trainBtn").disabled = true;
  document.getElementById("fightBtn").disabled = true;
}

setInterval(() => {
  if (!alive) return;
  hunger = Math.min(100, hunger + 1);
  fun = Math.max(0, fun - 1);
  energy = Math.max(0, energy - 1);
  updateStats();
}, 3000);

updateStats();
