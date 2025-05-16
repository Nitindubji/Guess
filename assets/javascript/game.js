const allWords = [
  "ZION", "YORK", "ARCH", "CAVE", "MESA",
  "ROCKY", "ACADIA", "GRAND", "YOSEMITE", "OLYMPIC",
  "GLACIER", "EVERGLADES", "BADLANDS", "BRYCE", "SEQUOIA",
  "DENALI", "SAGUARO", "REDWOOD", "PINNACLES", "HALEAKALA",
  "CHANNEL", "VOYAGEURS", "YELLOWSTONE", "GUADALUPE", "ISLE ROYALE",
  "WRANGELL", "AMERICAN SAMOA", "GREAT BASIN", "PETRIFIED FOREST"
];

let currentWord = "";
let guessedLetters = [];
let displayWord = [];
let guessesLeft = 6;
let score = 0;
let level = 1;
let usedWords = [];

const wordDisplay = document.getElementById("currentWord");
const guessedDisplay = document.getElementById("guessedLetters");
const guessesLeftDisplay = document.getElementById("remainingGuesses");
const scoreDisplay = document.getElementById("totalWins");
const welcomeMsg = document.getElementById("welcome");
const keyboardContainer = document.getElementById("keyboardContainer");
const levelDisplay = document.getElementById("level");

function getWordsForLevel(level) {
  const wordLength = 4 + level;
  return allWords.filter(word => word.replace(/ /g, "").length === wordLength && !usedWords.includes(word));
}

function pickNewWord() {
  const levelWords = getWordsForLevel(level);
  if (levelWords.length === 0) return null;
  return levelWords[Math.floor(Math.random() * levelWords.length)].toUpperCase();
}

function startGame() {
  guessedLetters = [];
  displayWord = [];
  guessesLeft = 6;
  welcomeMsg.classList.add("noBlink");
  welcomeMsg.classList.remove("blink");
  welcomeMsg.innerText = `Level ${level}`;

  currentWord = pickNewWord();
  if (!currentWord) {
    showBanner("YOU WIN!");
    return;
  }
  usedWords.push(currentWord);

  for (let char of currentWord) {
    displayWord.push(char === " " ? " " : "_");
  }

  updateDisplay();
  generateKeyboard();
}

function updateDisplay() {
  wordDisplay.innerText = displayWord.join(" ");
  guessedDisplay.innerText = guessedLetters.join(" ");
  guessesLeftDisplay.innerText = guessesLeft;
  scoreDisplay.innerText = score;
  levelDisplay.innerText = level;
}

function handleGuess(letter) {
  if (guessedLetters.includes(letter) || displayWord.includes(letter.toUpperCase())) return;

  const keyBtn = document.querySelector(`.key-button[data-key="${letter}"]`);
  let found = false;

  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] === letter.toUpperCase()) {
      displayWord[i] = letter.toUpperCase();
      found = true;
    }
  }

  if (found) {
    if (keyBtn) keyBtn.textContent = "∞";
    if (!displayWord.includes("_")) {
      score++;
      level++;
      updateDisplay();
      setTimeout(() => startGame(), 2000);
    }
  } else {
    guessedLetters.push(letter);
    guessesLeft--;
    if (keyBtn) keyBtn.textContent = "✖";
    if (guessesLeft === 0) {
      showBanner("GAME OVER");
      setTimeout(() => location.reload(), 3000);
    }
  }

  updateDisplay();
}

function generateKeyboard() {
  keyboardContainer.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  letters.split("").forEach(letter => {
    const button = document.createElement("button");
    button.className = "key-button btn btn-outline-primary m-1";
    button.textContent = letter;
    button.dataset.key = letter.toLowerCase();
    button.addEventListener("click", () => handleGuess(letter.toLowerCase()));
    keyboardContainer.appendChild(button);
  });
}

function showBanner(message) {
  welcomeMsg.innerText = message;
  welcomeMsg.classList.remove("noBlink");
  welcomeMsg.classList.add("blink");
  keyboardContainer.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {
  startGame();

  document.addEventListener("keyup", (event) => {
    const letter = event.key.toLowerCase();
    if (/^[a-z]$/.test(letter)) {
      handleGuess(letter);
    }
  });
});
