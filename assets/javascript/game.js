var possibleWords = [
  "GRAND CANYON", 
  "ROCKY MOUNTAIN", 
  "ZION", 
  "YELLOWSTONE",
  "YOSEMITE", 
  "GRAND TETON", 
  // "GLACIER", 
  // "ACADIA", 
  // "MAMMOTH CAVE", 
  // "OLYMPIC", 
  // "GREAT SMOKY MOUNTAINS",
  // "ARCHES",
  // "BRYCE CANYON",
  // "CARLSBAD CAVERNS",
  // "CRATER LAKE",
  // "DEATH VALLEY",
  // "DENALI",
  // "JOSHUA TREE",
  // "CAPITOL REEF",
  // "CANYON LANDS",
  // "BADLANDS",
  // "BIG BEND",
  // "SEQUOIA",
  // "BISCAYNE",
  // "SHENANDOAH",
  // "HOT SPRINGS",
  // "MOUNT RANIER",
  // "SAGUARO",
  // "KINGS CANYON",
  // "EVERGLADES",
  // "MESA VERDE",
  // "REDWOOD",
  // "CHANNEL ISLANDS",
  // "BLACK CANYON OF THE GUNNISON",
  // "CONGAREE",
  // "CUYAHOGA VALLEY",
  // "DRY TORTUGAS",
  // "GATEWAY ARCH",
  // "GATES OF THE ARCTIC",
  // "AMERICAN SAMOA",
  // "GLACIER BAY",
  // "GREAT BASIN",
  // "GUADALUPE MOUNTAINS",
  // "HAWAII VOLCANOES",
  // "HOT SPRINGS",
  // "INDIANA DUNES",
  // "KATMAI",
  // "KENAI FJORDS",
  // "LASSEN VOLCANIC",
  // "NORTH CASCADES",
  // "PETRIFIED FOREST",
  // "PINNACLES",
  // "THEODORE ROOSEVELT",
  // "VIRGIN ISLANDS",
  // "VOYAGEURS",
  // "WRANGELL ST ELIAS",
  // "WIND CAVE",
  // "KOBUK VALLEY",
  // "LAKE CLARK",
  // "ISLE ROYALE",
  // "HALEAKALA"
];

var guessedLetters = [];
var guessingWord = [];
var usedGuessingwWords = [];
var wordToMatch;
var numGuess;
var wins = 0;
var pause = false; // This var and setTimout function to not listen for keypress while game resets
var loseSound = new Audio("./assets/sounds/ahahah.mp3");
var winSound = new Audio("./assets/sounds/clever.wav");
var championSound = new Audio("./assets/sounds/crazysob.mp3");
// ... your existing variables here ...

// Generate virtual keyboard buttons on the page
function generateKeyboard() {
  const keyboardContainer = document.getElementById('keyboard');
  if (!keyboardContainer) return;

  keyboardContainer.innerHTML = ''; // Clear old buttons

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let char of alphabet) {
    const btn = document.createElement('button');
    btn.textContent = char;
    btn.classList.add('btn', 'btn-outline-primary', 'm-1');
    btn.style.width = '40px';
    btn.style.height = '40px';
    btn.style.fontWeight = 'bold';

    btn.addEventListener('click', () => {
      if (!btn.disabled && pause === false) {
        checkForLetter(char);
        btn.disabled = true;
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-primary');
      }
    });

    keyboardContainer.appendChild(btn);
  }
}

// Modify initializeGame to generate keyboard after setting up word
function initializeGame() {
  wordToMatch = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();

  if (wordToMatch.length <= 4) {
    numGuess = 4;
  } else if (wordToMatch.length > 4 && wordToMatch.length <= 7) {
    numGuess = Math.floor(wordToMatch.length * 0.67);
  } else if (wordToMatch.length > 7 && wordToMatch.length <= 10) {
    numGuess = Math.floor(wordToMatch.length * 0.5);
  } else if (wordToMatch.length > 10 && wordToMatch.length <= 14) {
    numGuess = Math.floor(wordToMatch.length * 0.52);
  } else if (wordToMatch.length > 14) {
    numGuess = 7;
  }

  guessingWord = [];
  for (var i = 0; i < wordToMatch.length; i++) {
    guessingWord.push(wordToMatch[i] === " " ? " " : "_");
  }

  generateKeyboard();  // <-- Add this line to generate keyboard buttons

  updateDisplay();
}

// Modify resetGame to generate keyboard after resetting arrays
function resetGame() {
  if (usedGuessingwWords.length === possibleWords.length) {
    championSound.play();
    usedGuessingwWords = [];
    wins = 0;
    setTimeout(resetGame, 6000);
  } else {
    pause = false;
    document.getElementById('welcome').className = 'blink';

    wordToMatch = possibleWords[Math.floor(Math.random() * possibleWords.length)].toUpperCase();
    if (usedGuessingwWords.includes(wordToMatch)) {
      resetGame();
      return;
    }

    if (wordToMatch.length <= 4) {
      numGuess = 4;
    } else if (wordToMatch.length > 4 && wordToMatch.length <= 7) {
      numGuess = Math.floor(wordToMatch.length * 0.67);
    } else if (wordToMatch.length > 7 && wordToMatch.length <= 10) {
      numGuess = Math.floor(wordToMatch.length * 0.5);
    } else if (wordToMatch.length > 10 && wordToMatch.length <= 14) {
      numGuess = Math.floor(wordToMatch.length * 0.52);
    } else if (wordToMatch.length > 14) {
      numGuess = 7;
    }

    guessedLetters = [];
    guessingWord = [];
    for (var i = 0; i < wordToMatch.length; i++) {
      guessingWord.push(wordToMatch[i] === " " ? " " : "_");
    }

    generateKeyboard();  // <-- Add this line to reset keyboard

    updateDisplay();
  }
}

// Modify keydown event to disable virtual keys when typing physical keyboard letters
document.onkeydown = function(event) {
  if (isLetter(event.key) && pause === false) {
    let letter = event.key.toUpperCase();
    checkForLetter(letter);

    // Disable matching button on virtual keyboard
    const buttons = document.querySelectorAll('#keyboard button');
    buttons.forEach(button => {
      if (button.textContent === letter) {
        button.disabled = true;
        button.classList.remove('btn-outline-primary');
        button.classList.add('btn-primary');
      }
    });
  }
  document.getElementById('welcome').className = 'noBlink';
};

// Modify checkForLetter to disable buttons after guessing (optional but better UX)
function checkForLetter(letter) {
  var foundLetter = false;

  for (var i = 0; i < wordToMatch.length; i++) {
    if (letter === wordToMatch[i]) {
      guessingWord[i] = letter;
      foundLetter = true;
      if (guessingWord.join("") === wordToMatch) {
        wins++;
        usedGuessingwWords.push(wordToMatch);
        pause = true;
        winSound.play();
        updateDisplay();
        setTimeout(resetGame, 4000);
      }
    }
  }

  if (!foundLetter) {
    if (!guessedLetters.includes(letter)) {
      guessedLetters.push(letter);
      numGuess--;
    }
    if (numGuess === 0) {
      usedGuessingwWords.push(wordToMatch);
      guessingWord = wordToMatch.split("");
      pause = true;
      loseSound.play();
      setTimeout(resetGame, 4000);
    }
  }

  // Disable button for guessed letter on virtual keyboard
  const buttons = document.querySelectorAll('#keyboard button');
  buttons.forEach(button => {
    if (button.textContent === letter) {
      button.disabled = true;
      button.classList.remove('btn-outline-primary');
      button.classList.add('btn-primary');
    }
  });

  updateDisplay();
};
