// const playerOneIcon = document.querySelector('#player1');
// const playerTwoIcon = document.querySelector('#player2');

class Player {
  constructor(isTurn, selectedBoardSlot, gameIconDOMSelector, gamePiece) {
    this.isTurn = isTurn;
    this.selectedBoardSlot = selectedBoardSlot;
    this.gameIconDOMSelector = gameIconDOMSelector;
    this.gamePiece = gamePiece;

  }

  set name(name) {
    this._name = name;
  }

  get name() {
    this._name = name;
  }

  setGameIconClass(cls) {
    document.querySelector(this.gameIconDOMSelector).classList.add(cls);
  }
}

const playerOne = new Player(true, 'box-filled-1', '#player1', "url('img/o.svg')");
const playerTwo = new Player(false, 'box-filled-2', '#player2', "url('img/x.svg')");

const players = [];
players.push(playerOne, playerTwo);

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


players.forEach(player => {
  if (player.isTurn === true) {
    player.setGameIconClass('active');

    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
      box.addEventListener('mouseover', (e) => {
        e.target.style.backgroundImage =  player.gamePiece;
      });
      box.addEventListener('mouseout', (e) => {
        e.target.style.backgroundImage = 'none';
      });
      box.addEventListener('click', (e) => {
        e.target.classList.add(player.selectedBoardSlot);
      });
    });
  }
});

