// Water Drop Game

/* Water Drop — Project 6 */

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start-btn");
const messageDisplay = document.getElementById("message");
const startMessage = document.getElementById("start-message");

// Game settings
const GAME_LENGTH = 30;
const WIN_SCORE = 15;
const DROP_INTERVAL = 800;
const DIRTY_CHANCE = 0.25;

// Game state variables
let score = 0;
let timeLeft = GAME_LENGTH;
let gameRunning = false;
let dropMaker = null;
let timer = null;
let activeDrops = new Set();

// Start or restart the game
startButton.addEventListener("click", startGame);

function startGame() {
    // Clear any previous timers
    clearInterval(dropMaker);
    clearInterval(timer);

    // Reset the game state
    gameRunning = true;
    score = 0;
    timeLeft = GAME_LENGTH;

    // Remove old drops and confetti
    activeDrops.forEach(drop => {
        clearTimeout(drop.fallTimeout);
    });

    activeDrops.clear();
    gameContainer.innerHTML = "";

    // Update the display
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    messageDisplay.textContent = "Catch the clean drops!";
    startButton.textContent = "Restart Game";

    // Create new drops
    startMessage?.remove();

    dropMaker = setInterval(createDrop, DROP_INTERVAL);

    // Start the countdown
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// Create a falling water drop
function createDrop() {
    if (!gameRunning) return;

    const drop = document.createElement("button");
    const isDirty = Math.random() < DIRTY_CHANCE;

    drop.type = "button";
    drop.className = isDirty
        ? "water-drop dirty-drop"
        : "water-drop clean-drop";

    drop.setAttribute(
        "aria-label",
        isDirty ? "Dirty water: lose 2 points" : "Clean water: earn 1 point"
    );

    // Random size
    const size = 40 + Math.random() * 20;
    drop.style.width = `${size}px`;
    drop.style.height = `${size}px`;

    // Random horizontal position
    const maxLeft = Math.max(0, gameContainer.clientWidth - size);
    drop.style.left = `${Math.random() * maxLeft}px`;

    // Random falling speed
    const fallDuration = 3 + Math.random() * 2;
    drop.style.animationDuration = `${fallDuration}s`;

    // Store a reference to this drop
    activeDrops.add(drop);
    gameContainer.appendChild(drop);

    // Handle a successful click
    drop.addEventListener("click", () => {
        if (!gameRunning || !activeDrops.has(drop)) return;

        if (isDirty) {
            score = Math.max(0, score - 2);
            messageDisplay.textContent = "Oops! Dirty water! -2 points";
        } else {
            score++;
            messageDisplay.textContent = "Great catch! +1 point";
        }

        scoreDisplay.textContent = score;

        removeDrop(drop);

        // Win when the target score is reached
        if (score >= WIN_SCORE) {
            endGame(true);
        }
    });

    // Remove drops that reach the bottom uncaught
    drop.addEventListener("animationend", () => {
        removeDrop(drop);
    });
}

// Remove a drop and clean up its timeout if necessary
function removeDrop(drop) {
    if (!activeDrops.has(drop)) return;

    activeDrops.delete(drop);

    if (drop.fallTimeout) {
        clearTimeout(drop.fallTimeout);
    }

    drop.remove();
}

// End the game
function endGame(won) {
    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(dropMaker);
    clearInterval(timer);

    // Remove all drops
    activeDrops.forEach(drop => {
        if (drop.fallTimeout) {
            clearTimeout(drop.fallTimeout);
        }
        drop.remove();
    });

    activeDrops.clear();

    if (won) {
        messageDisplay.textContent =
            "You won! You collected enough clean water!";

        celebrateWin();
    } else {
        messageDisplay.textContent =
            `Time's up! Your final score is ${score}.`;
    }

    startButton.textContent = "Play Again";
}

// Celebrate the win with confetti
function celebrateWin() {
    const confettiSymbols = ["🎉", "💧", "✨", "⭐"];

    for (let i = 0; i < 35; i++) {
        const confetti = document.createElement("span");

        confetti.className = "confetti";
        confetti.textContent =
            confettiSymbols[Math.floor(Math.random() * confettiSymbols.length)];

        confetti.style.left = `${Math.random() * 95}%`;
        confetti.style.top = `${Math.random() * 80}%`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;

        gameContainer.appendChild(confetti);
    }
}
