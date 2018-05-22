class Player {
  constructor({ isTurn = false, selectedBoardSlot = null, gameIconDOMSelector = null, gamePiece = null, winScreen = null, name = 'Player' }) {
    this.isTurn = isTurn;
    this.selectedBoardSlot = selectedBoardSlot;
    this.gameIconDOMSelector = gameIconDOMSelector;
    this.gamePiece = gamePiece;
    this._winScreen = winScreen;

    this._name = name;
    this._selectedSpots = [];
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  get winScreen() {
    return this._winScreen;
  }

  get selectedSpots() {
    return this._selectedSpots;
  }

  pushSpot(spot) {
    this._selectedSpots.push(spot);
  }

  setGameIconClass(cls) {
    document.querySelector(this.gameIconDOMSelector).classList.add(cls);
  }

  removeGameIconClass(cls) {
    document.querySelector(this.gameIconDOMSelector).classList.remove(cls);
  }
}

class GameManager {
  constructor({ players = [], activePlayer = null, turnCounter = 0 }) {
    this._players = players;
    this._activePlayer = activePlayer;
    this._turnCounter = turnCounter;

    this._winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2],
    ];
  }

  get players() {
    return this._players;
  }

  // Returns the currently acive player
  get activePlayer() {
    return this._activePlayer;
  }

  get turnCounter() {
    return this._turnCounter;
  }

  set turnCounter(value) {
    this._turnCounter = value;
  }

  incrementTurnCounter() {
    this._turnCounter = this._turnCounter + 1;
  }

  /**
   * Sets all other player's to not active.
   * Sets the provided player to active.
   *
   * @param {Player} newActivePlayer
   */
  changeActivePlayer(newActivePlayer) {
    this.players.forEach(player => player.isTurn = false);
    newActivePlayer.isTurn = true;
    newActivePlayer.setGameIconClass('active');
    this._activePlayer = newActivePlayer;

    const unActivePlayer = this.players.filter(player => player.isTurn === false);
    unActivePlayer[0].removeGameIconClass('active');
  }

  /**
   * Determines if there's a winner
   *
   * @param {Array} plays The spots a player has selected
   * @returns {Boolean} True if a winner, otherwise false
   */
  checkWinner(plays) {
    if (this.turnCounter >= 9) {
      // TODO: Too many turns, so end the game
    }

    for (const [index, win] of this._winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        return true;
      }
    }

    return false;
  }

  resetGame() {

  }
}

const playerOne = new Player({
  isTurn: true,
  selectedBoardSlot: 'box-filled-1',
  gameIconDOMSelector: '#player1',
  gamePiece: "url('img/o.svg')",
  winScreen: 'screen-win-one'
});

const playerTwo = new Player({
  isTurn: false,
  selectedBoardSlot: 'box-filled-2',
  gameIconDOMSelector: '#player2',
  gamePiece: "url('img/x.svg')",
  winScreen: 'screen-win-two'
});

const gameManager = new GameManager({
  players: [ playerOne, playerTwo ],
});

gameManager.changeActivePlayer(playerOne);

const startGameScreen = () => {
  let startScreenHTML = `
    <div class="screen screen-start" id="start">
      <header>
        <h1>Tic Tac Toe</h1>
        <input id="nameInput" type="text" placeholder="Name"/>
        <a href="#" class="button">Start game</a>
      </header>
    </div>`;

  const body = document.querySelector('body');
  body.innerHTML += startScreenHTML;
};

startGameScreen();

const overlay = document.querySelector('.screen');
const startButton = document.querySelector('.button');

startButton.addEventListener('click', () => {
  const nameInput = document.querySelector('#nameInput');

  if (nameInput.value != '') {
    playerOne._name = nameInput.value;
    const userNameHTML = `<div class="playerName">Good luck, ${playerOne._name}!</div>`;
    const header = document.querySelector('.board header');
    header.innerHTML += userNameHTML;
  }

  overlay.style.display = "none";
});

const activePlayer = gameManager.players.filter(player => player.isTurn === true);
activePlayer[0].setGameIconClass('active');

const boxes = document.querySelectorAll('.box');

const boxHandleClick = (e) => {
  if (e.target.classList.item(2) != 'disabled') {
    const index = parseInt(e.target.getAttribute('data-box-index'));

    e.target.classList.add(gameManager.activePlayer.selectedBoardSlot);

    // Add the selected spot to the user who made the move
    gameManager.activePlayer.pushSpot(index);
    gameManager.incrementTurnCounter();
    const gameWon = gameManager.checkWinner(gameManager.activePlayer.selectedSpots);

    if (gameWon) {
      // TODO: Someone won, so show the screen and who won
      overlay.style.display = "";
      overlay.classList.replace('screen-start', 'screen-win');
      overlay.classList.add(gameManager.activePlayer.winScreen);
    }

    gameManager.changeActivePlayer(gameManager.players.filter(player => player.isTurn === false)[0]);

    e.target.classList.add('disabled');
  }
};

const boxHandleMouseOver = (e) => {
  if (e.target.classList.item(2) != 'disabled') {
    e.target.style.backgroundImage = gameManager.activePlayer.gamePiece;
  }
};

const boxHandleMouseOut = (e) => {
  if (e.target.classList.length <= 1 ) {
    e.target.style.backgroundImage = 'none';
  }
};

const eventListenerForPlayer = (player) => {
  boxes.forEach(box => {
    box.addEventListener('click', boxHandleClick);
    box.addEventListener('mouseover', boxHandleMouseOver);
    box.addEventListener('mouseout', boxHandleMouseOut);
  });
};

eventListenerForPlayer(playerOne);

const removeEventListenerForPlayer = () => {
  boxes.forEach(box => {
    box.removeEventListener('mouseover', boxHandleMouseOver, false);
    box.removeEventListener('click', boxHandleClick, false);
    box.removeEventListener('mouseout', boxHandleMouseOut, false);
  });
};
