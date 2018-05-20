class Player {
  constructor() {
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    this._name = name;
  }
}

const playerOne = new Player();
const playerTwo = new Player();

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
  }

  document.querySelector('.screen-start').remove();

  const userNameHTML = `<div class="playerName">Good luck, ${playerOne._name}!</div>`;
  const header = document.querySelector('.board header');
  header.innerHTML += userNameHTML;
});
