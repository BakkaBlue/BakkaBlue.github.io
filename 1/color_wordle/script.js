const colorPalettes = {
  easy: ["red", "green", "blue", "yellow", "purple", "orange"],
  medium: ["red", "green", "blue", "yellow", "purple", "orange", "pink", "cyan"],
  hard: ["red", "green", "blue", "yellow", "purple", "orange", "pink", "cyan", "black", "white"]
};

const settings = {
  easy: { length: 4, tries: 10 },
  medium: { length: 5, tries: 8 },
  hard: { length: 6, tries: 6 }
};

let currentPalette = [];
let answer = [];
let gameSettings = {};
let currentRow = 1;
let difficulty = "easy";
let hardcore = false;

function startGame(diff, isHardcore = false) {
  difficulty = diff;
  hardcore = isHardcore;
  document.getElementById("difficulty-select").style.display = "none";
  document.getElementById("game-container").style.display = "block";
  document.getElementById("submit").disabled = false;
  currentPalette = colorPalettes[diff];
  gameSettings = settings[diff];
  answer = [];

  const used = new Set();
  while (answer.length < gameSettings.length) {
    const rand = currentPalette[Math.floor(Math.random() * currentPalette.length)];
    if (!used.has(rand)) {
      used.add(rand);
      answer.push(rand);
    }
  }

  buildBoard();
  buildPalette();
  document.getElementById("status").innerText = "Make your guess";
}

function buildBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  // First row: random guess + feedback
  const hintRow = document.createElement("div");
  hintRow.classList.add("row");

  let hintGuess = [];
  const used = new Set();
  while (hintGuess.length < gameSettings.length) {
    const rand = currentPalette[Math.floor(Math.random() * currentPalette.length)];
    if (!used.has(rand)) {
      used.add(rand);
      hintGuess.push(rand);
    }
  }

  let green = 0, gray = 0, black = 0;
  const tempUsed = Array(gameSettings.length).fill(false);
  for (let i = 0; i < gameSettings.length; i++) {
    if (hintGuess[i] === answer[i]) {
      green++;
      tempUsed[i] = true;
    }
  }
  for (let i = 0; i < gameSettings.length; i++) {
    if (hintGuess[i] !== answer[i]) {
      const idx = answer.findIndex((color, j) => color === hintGuess[i] && !tempUsed[j]);
      if (idx !== -1) {
        gray++;
        tempUsed[idx] = true;
      } else {
        black++;
      }
    }
  }

  hintGuess.forEach((color) => {
    const boxWrapper = document.createElement("div");
    boxWrapper.classList.add("box-wrapper");
    const box = document.createElement("div");
    box.classList.add("color-box");
    box.style.backgroundColor = color;
    boxWrapper.appendChild(box);
    boxWrapper.appendChild(document.createElement("div"));
    hintRow.appendChild(boxWrapper);
  });

  const hintNote = document.createElement("div");
  hintNote.classList.add("hard-indicator");
  hintNote.innerHTML = `
    <span style="color:green;">🟢 ${green}</span>
    <span style="color:gray;">⚪ ${gray}</span>
    <span style="color:black;">⚫ ${black}</span>
  `;
  hintRow.appendChild(hintNote);
  board.appendChild(hintRow);

  // Game input rows
  for (let i = 0; i < gameSettings.tries; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < gameSettings.length; j++) {
      const boxWrapper = document.createElement("div");
      boxWrapper.classList.add("box-wrapper");

      const box = document.createElement("div");
      box.classList.add("color-box");
      box.dataset.row = i + 1;
      box.dataset.col = j;
      box.onclick = () => pickBox(i + 1, j);

      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      indicator.dataset.row = i + 1;
      indicator.dataset.col = j;

      boxWrapper.appendChild(box);
      boxWrapper.appendChild(indicator);
      row.appendChild(boxWrapper);
    }

    const result = document.createElement("div");
    result.classList.add("hard-indicator");
    result.id = `hard-result-${i + 1}`;
    row.appendChild(result);

    board.appendChild(row);
  }
}

function buildPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  currentPalette.forEach(color => {
    const p = document.createElement("div");
    p.classList.add("palette-color");
    p.style.backgroundColor = color;
    p.onclick = () => selectColor(color);
    palette.appendChild(p);
  });
}

let selectedCol = null;

function pickBox(row, col) {
  if (row !== currentRow) return;
  selectedCol = col;
}

function selectColor(color) {
  if (selectedCol === null) return;
  const box = document.querySelector(
    `.color-box[data-row='${currentRow}'][data-col='${selectedCol}']`
  );
  box.style.backgroundColor = color;
  box.dataset.color = color;
  selectedCol = null;
}

function submitGuess() {
  const rowBoxes = document.querySelectorAll(
    `.color-box[data-row='${currentRow}']`
  );
  const guess = Array.from(rowBoxes).map(box => box.dataset.color);

  if (guess.includes(undefined)) {
    alert("Please fill in all colors before submitting.");
    return;
  }

  const unique = new Set(guess);
  if (unique.size !== guess.length) {
    alert("No repeated colors allowed!");
    return;
  }

  const feedback = [];
  const used = Array(gameSettings.length).fill(false);
  let green = 0, gray = 0, black = 0;

  for (let i = 0; i < gameSettings.length; i++) {
    if (guess[i] === answer[i]) {
      feedback[i] = "green";
      used[i] = true;
      green++;
    }
  }

  for (let i = 0; i < gameSettings.length; i++) {
    if (!feedback[i]) {
      const idx = answer.findIndex((color, j) => color === guess[i] && !used[j]);
      if (idx !== -1) {
        feedback[i] = "gray";
        used[idx] = true;
        gray++;
      } else {
        feedback[i] = "black";
        black++;
      }
    }
  }

  const result = document.getElementById(`hard-result-${currentRow}`);
  if (hardcore) {
    result.innerHTML = `
      <span style="color:green;">🟢 ${green}</span>
      <span style="color:gray;">⚪ ${gray}</span>
      <span style="color:black;">⚫ ${black}</span>
    `;
  } else {
    for (let i = 0; i < gameSettings.length; i++) {
      const indicator = document.querySelector(
        `.indicator[data-row='${currentRow}'][data-col='${i}']`
      );
      indicator.style.backgroundColor = feedback[i];
    }
  }

  if (green === gameSettings.length) {
    document.getElementById("status").innerText = "🎉 You Win!";
    document.getElementById("submit").disabled = true;
    return;
  }

  currentRow++;
  if (currentRow > gameSettings.tries) {
    document.getElementById("status").innerText =
      "😢 Game Over! Answer: " + answer.join(", ");
    document.getElementById("submit").disabled = true;
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function goBack() {
  location.reload();
}
