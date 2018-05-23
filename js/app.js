class Player {
  constructor({ isTurn = false, selectedBoardSlot = null, gameIconDOMSelector = null, gamePiece = null, winScreen = null, buttonColor = null, name = 'Player' }) {
    this.isTurn = isTurn;
    this.selectedBoardSlot = selectedBoardSlot;
    this.gameIconDOMSelector = gameIconDOMSelector;
    this.gamePiece = gamePiece;
    this._winScreen = winScreen;
    this._buttonColor = buttonColor;

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

  get buttonColor() {
    return this._buttonColor;
  }

  set selectedSpots(selectedSpots) {
    this._selectedSpots = selectedSpots;
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
  constructor({ players = [], activePlayer = null, turnCounter = 0, startButton = null, overlay = null }) {
    this._players = players;
    this._activePlayer = activePlayer;
    this._turnCounter = turnCounter;
    this._isGameWon = null;
    this._startButton = startButton;
    this._overlay = overlay;

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

  set isGameWon(isGameWon) {
    this._isGameWon = isGameWon;
  }

  get isGameWon() {
    return this._isGameWon;
  }

  incrementTurnCounter() {
    this._turnCounter = this._turnCounter + 1;
  }

  /**
   * Displays the start game overlay
   */
  startGameScreen() {
    const startScreenHTML = `
    <div class="screen screen-start" id="start">
      <header>
        <h1>Tic Tac Toe</h1>
        <a href="#" class="button">Start game</a>
      </header>
    </div>`;

    const body = document.querySelector('body');
    body.innerHTML += startScreenHTML;

    this._overlay = document.querySelector('.screen');
    this._startButton = document.querySelector('.button');

    this._startButton.addEventListener('click', () => {
      this._overlay.style.display = "none";

      if (this._startButton.textContent === 'New game') {
        this.resetGame();
      }
    });

    const activePlayer = this.players.filter(player => player.isTurn === true);
    activePlayer[0].setGameIconClass('active');
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
    if (this.isGameWon === null && this.turnCounter >= 9) {
      this.displayTie();
      return;
    }

    for (const [index, win] of this._winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Displays the win screen
   */
  displayWinner() {
    this.displayWinnerScreen('Winner', this.activePlayer.winScreen);
    this._startButton.style.color = this.activePlayer.buttonColor;
  }

  /**
   * Displays the tie screen
   */
  displayTie() {
    this.displayWinnerScreen('Tie', 'screen-win-tie');
  }

  /**
   * Resets the game board for a new game
   */
  resetGame() {
    boxes.forEach(box => {
      box.style.backgroundImage = "none";
      box.classList.remove('box-filled-1', 'box-filled-2', 'disabled');
    });

    document.querySelector('.winner').remove();

    this._overlay.classList.remove('screen-win-one', 'screen-win-two');
    this.players.forEach(player => player.selectedSpots = []);

    this.turnCounter = 0;
    this.isGameWon = null;
  }

  /**
   * Creates the winner element
   * @param {String} overlayText - The text to display
   * @param {String} overlayClass - The class to apply
   */
  displayWinnerScreen(overlayText, overlayClass) {
    this._startButton.textContent = 'New game';

    const winner = document.createElement('div');
    winner.textContent = overlayText;
    winner.className = 'winner';

    const overlayHeader = document.querySelector('.screen header');
    overlayHeader.insertBefore(winner, this._startButton);

    this._overlay.style.display = 'inline';
    this._overlay.classList.replace('screen-start', 'screen-win');
    this._overlay.classList.add(overlayClass);
    this._overlay.setAttribute('id', 'finish');
  }
}

const playerOne = new Player({
  isTurn: true,
  selectedBoardSlot: 'box-filled-1',
  gameIconDOMSelector: '#player1',
  gamePiece: "url('img/o.svg')",
  winScreen: 'screen-win-one',
  buttonColor: '3688C3'
});

const playerTwo = new Player({
  isTurn: false,
  selectedBoardSlot: 'box-filled-2',
  gameIconDOMSelector: '#player2',
  gamePiece: "url('img/x.svg')",
  winScreen: 'screen-win-two',
  buttonColor: 'FFA000'
});

const gameManager = new GameManager({
  players: [ playerOne, playerTwo ]
});

gameManager.startGameScreen();
gameManager.changeActivePlayer(playerOne);

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
      gameManager.displayWinner();

      let winner = document.querySelector('.winner');
      winner.style.backgroundImage = gameManager.activePlayer.gamePiece;

      gameManager.isGameWon = true;
    }

    gameManager.changeActivePlayer(gameManager.players.filter(player => player.isTurn === false)[0]);

    e.target.classList.add('disabled');
  }
};

// Event handlers for mouseover, mouseout, and click on boxes.
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

const eventListenerForPlayer = () => {
  boxes.forEach(box => {
    box.addEventListener('click', boxHandleClick);
    box.addEventListener('mouseover', boxHandleMouseOver);
    box.addEventListener('mouseout', boxHandleMouseOut);
  });
};

eventListenerForPlayer();
