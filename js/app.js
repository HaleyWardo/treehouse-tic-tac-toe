class Player {
  constructor({ isTurn, selectedBoardSlot, gameIconDOMSelector, gamePiece }) {
    this.isTurn = isTurn ? isTurn : false;
    this.selectedBoardSlot = selectedBoardSlot ? selectedBoardSlot : null;
    this.gameIconDOMSelector = gameIconDOMSelector ? gameIconDOMSelector : null;
    this.gamePiece = gamePiece ? gamePiece : null;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  setGameIconClass(cls) {
    document.querySelector(this.gameIconDOMSelector).classList.add(cls);
  }
}

class GameManager {
  constructor({ players = [], activePlayer = null, turnCounter }) {
    this._players = players;
    this._activePlayer = activePlayer;
    this._turnCounter = turnCounter;
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

    // Remove all mouseover, click, etc. event handlers OR EDIT THE EXISTING ONES
    // TO USE THE NEW PLAYER'S 'X' OR 'O'
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
  }
}

const playerOne = new Player({
  isTurn: true,
  selectedBoardSlot: 'box-filled-1',
  gameIconDOMSelector: '#player1',
  gamePiece: "url('img/o.svg')"
});

const playerTwo = new Player({
  isTurn: false,
  selectedBoardSlot: 'box-filled-2',
  gameIconDOMSelector: '#player2',
  gamePiece: "url('img/x.svg')"
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
}
startGameScreen();

const startButton = document.querySelector('.button');

startButton.addEventListener('click', () => {
  const nameInput = document.querySelector('#nameInput');

  if (nameInput.value != '') {
    playerOne._name = nameInput.value;
    const userNameHTML = `<div class="playerName">Good luck, ${playerOne._name}!</div>`;
    const header = document.querySelector('.board header');
    header.innerHTML += userNameHTML;
  }
  document.querySelector('.screen-start').remove();
});

const boxes = document.querySelectorAll('.box');

gameManager.players.forEach(player => {
  const activePlayer = gameManager.activePlayer;
  if (player.isTurn === true) {
    player.setGameIconClass('active');
  }
});

const eventListenerForPlayer = (player) => {
  boxes.forEach(box => {

    box.addEventListener('mouseover', (e) => {
      e.target.style.backgroundImage = gameManager.activePlayer.gamePiece;

        box.addEventListener('click', (e) => {
          e.target.classList.add(gameManager.activePlayer.selectedBoardSlot);
          gameManager.changeActivePlayer(gameManager.players.filter(player => player.isTurn === false)[0]);
        });
    });

    box.addEventListener('mouseout', (e) => {
      if (e.target.classList.length <= 1) {
        e.target.style.backgroundImage = 'none';
      }
    });
  });
}
eventListenerForPlayer(playerOne);