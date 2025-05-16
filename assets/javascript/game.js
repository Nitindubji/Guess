const words = [
  "ARCH", "ZION", "MESA", "ROCKY", "YOSEMITE",
  "DENALI", "BRYCE", "CANYON", "GLACIER", "OLYMPIC"
];

let currentWord = "";
let displayWord = [];
let guessedLetters = [];
let guessesLeft = 6;
let score = 0;

const wordDisplay = document.getElementById("currentWord");
const guessedDisplay = document.getElementById("guessedLetters");
const guessesLeftDisplay = document.getElementById("remainingGuesses");
const scoreDisplay = document.getElementById("totalWins");
const welcomeMsg = document.getElementById("welcome");
const keyboardContainer = document.getElementById("keyboardContainer");

function startGame() {
  guessedLetters = [];
  guessesLeft = 6;
  currentWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
  displayWord = Array.from(currentWord).map(char => (char === " " ? " " : "_"));
  updateDisplay();
  generateKeyboard();
  welcomeMsg.textContent = "Press Any Key or Click Letters To Start!";
  welcomeMsg.classList.add("blink");
}

function updateDisplay() {
  wordDisplay.textContent = displayWord.join(" ");
  guessedDisplay.textContent = guessedLetters.join(" ");
  guessesLeftDisplay.textContent = guessesLeft;
  scoreDisplay.textContent = score;
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);
  if (currentWord.includes(letter)) {
    Array.from(currentWord).forEach((char, i) => {
      if (char === letter) displayWord[i] = letter;
    });

    if (!displayWord.includes("_")) {
      score++;
      showMessage("Correct! Starting next word...");
      setTimeout(startGame, 2000);
    }
  } else {
    guessesLeft--;
    if (guessesLeft === 0) {
      showMessage("Game Over! Restarting...");
      setTimeout(startGame, 2000);
    }
  }

  updateDisplay();
  disableKey(letter);
}

function generateKeyboard() {
  keyboardContainer.innerHTML = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  alphabet.split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = "key-button";
    btn.addEventListener("click", () => handleGuess(letter));
    btn.id = `key-${letter}`;
    keyboardContainer.appendChild(btn);
  });
}

function disableKey(letter) {
  const btn = document.getElementById(`key-${letter}`);
  if (btn) btn.disabled = true;
}

function showMessage(msg) {
  welcomeMsg.textContent = msg;
  welcomeMsg.classList.remove("blink");
}

document.addEventListener("DOMContentLoaded", () => {
  startGame();

  // Optional: Add keypress support for physical keyboard
  document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      handleGuess(letter);
    }
  });
});
