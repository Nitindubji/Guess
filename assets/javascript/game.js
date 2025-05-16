// Your script.js file with full game logic, keyboard, scoring, banners, and difficulty level

let wordList = [
  "apple", "zebra", "lucky", "hello", "chair", "piano",
  "planet", "mystery", "journey", "holiday",
  "fantastic", "mountains", "adventure", "difficult",
  "imagination", "architecture", "congratulation", "hindunberger"
];

let wordToMatch = "";
let guessingWord = [];
let guessedLetters = [];
let remainingGuesses = 6;
let score = 0;
let level = 1;
let maxLevel = 20;
let pause = false;

const winSound = new Audio("assets/audio/smb3_powerup.wav");
const loseSound = new Audio("assets/audio/smb3_mariodie.wav");

function chooseWord() {
  const levelLength = Math.min(4 + level, 12); // start from 5-letter words
  const filteredWords = wordList.filter(word => word.length === levelLength);
  wordToMatch = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  guessingWord = Array(wordToMatch.length).fill("_");
  guessedLetters = [];
  remainingGuesses = 6;
  updateDisplay();
  resetKeyboard();
  pause = false;
}

function updateDisplay() {
  document.getElementById("wordSpotlight").innerText = guessingWord.join(" ");
  document.getElementById("guessesRemaining").innerText = `Guesses Remaining: ${remainingGuesses}`;
  document.getElementById("guessedLetters").innerText = `Guessed Letters: ${guessedLetters.join(", ")}`;
  document.getElementById("score").innerText = `Score: ${score}`;
  document.getElementById("level").innerText = `Level: ${level}`;
}

function showBanner(type) {
  const winBanner = document.getElementById("winBanner");
  const loseBanner = document.getElementById("loseBanner");

  if (type === "win") {
    winBanner.style.display = "block";
    setTimeout(() => { winBanner.style.display = "none"; }, 2500);
  } else if (type === "lose") {
    loseBanner.style.display = "block";
    setTimeout(() => { loseBanner.style.display = "none"; }, 2500);
  }
}

function handleGuess(letter) {
  if (pause || guessedLetters.includes(letter)) return;
  guessedLetters.push(letter);
  document.getElementById(letter).disabled = true;

  if (wordToMatch.includes(letter)) {
    for (let i = 0; i < wordToMatch.length; i++) {
      if (wordToMatch[i] === letter) {
        guessingWord[i] = letter;
      }
    }
    document.getElementById(letter).innerText = "8"; // Correct guess mark
  } else {
    remainingGuesses--;
    document.getElementById(letter).innerText = "X"; // Wrong guess mark
  }

  updateDisplay();

  if (guessingWord.join("") === wordToMatch) {
    score += 50;
    level++;
    winSound.play();
    pause = true;
    showBanner("win");
    setTimeout(chooseWord, 3000);
  } else if (remainingGuesses <= 0) {
    guessingWord = wordToMatch.split("");
    loseSound.play();
    pause = true;
    showBanner("lose");
    updateDisplay();
    setTimeout(chooseWord, 3000);
  }
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  const letters = "abcdefghijklmnopqrstuvwxyz";
  keyboard.innerHTML = "";

  for (let char of letters) {
    const btn = document.createElement("button");
    btn.innerText = char;
    btn.id = char;
    btn.className = "key";
    btn.onclick = () => handleGuess(char);
    keyboard.appendChild(btn);
  }
}

function resetKeyboard() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  for (let char of letters) {
    const btn = document.getElementById(char);
    if (btn) {
      btn.disabled = false;
      btn.innerText = char;
    }
  }
}

function startGame() {
  level = 1;
  score = 0;
  createKeyboard();
  chooseWord();
}

startGame();
