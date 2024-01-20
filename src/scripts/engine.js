/* Objeto que armazena o estado do jogo */
const state = {
  /* Objeto que armazena o placar do jogo */
  score: {
    playerScore: 0,
    computerScore: 0,

    // Recupera o bloco do placar
    scoreBox: document.getElementById("score_points"),
  },

  /* Objeto que armazena as informações das cartas */
  cardSprites: {
    // Recuperam a imagem, nome e tipo das cartas
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },

  /* Objeto que armazena as cartas em campo */
  fieldCards: {
    // Recuperam as mãos do jogador e do computador
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },

  /* Objeto que armazena os Ids dos campos de cartas */
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },

  /* Objeto que armazena o botão do duelo */
  actions: {
    // Recupera o botão do duelo
    button: document.getElementById("next-duel"),
  },
};

/* Caminho base das imagens */
const pathImages = "./src/assets/icons/";

/* Enumeração, listagem das cartas */
const cardData = [
  {
    id: 0,
    name: "Blue-Eyes White Dragon",
    type: "Rock",
    img: `${pathImages}blue-eye.png`,
    WinOf: [5, 6, 8],
    LoseOf: [1, 4, 7],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Paper",
    img: `${pathImages}dark-magician.png`,
    WinOf: [0, 2, 3],
    LoseOf: [5, 6, 8],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Rock",
    img: `${pathImages}exodia.png`,
    WinOf: [5, 6, 8],
    LoseOf: [1, 4, 7],
  },
  {
    id: 3,
    name: "Red-Eyes Black Dragon",
    type: "Rock",
    img: `${pathImages}black-dragon.png`,
    WinOf: [5, 6, 8],
    LoseOf: [1, 4, 7],
  },
  {
    id: 4,
    name: "Dark Magician Girl",
    type: "Paper",
    img: `${pathImages}dark-girl.png`,
    WinOf: [0, 2, 3],
    LoseOf: [5, 6, 8],
  },
  {
    id: 5,
    name: "Harpie Lady Sisters",
    type: "Scissors",
    img: `${pathImages}harpie.png`,
    WinOf: [1, 4, 7],
    LoseOf: [0, 2, 3],
  },
  {
    id: 6,
    name: "Cyber Commander",
    type: "Scissors",
    img: `${pathImages}cyber.png`,
    WinOf: [1, 4, 7],
    LoseOf: [0, 2, 3],
  },
  {
    id: 7,
    name: "Magician of Faith",
    type: "Paper",
    img: `${pathImages}faith.png`,
    WinOf: [0, 2, 3],
    LoseOf: [5, 6, 8],
  },
  {
    id: 8,
    name: "Time Wizard",
    type: "Scissors",
    img: `${pathImages}time.png`,
    WinOf: [1, 4, 7],
    LoseOf: [0, 2, 3],
  },
];

/* Função para sortear um id de uma carta */
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

/* Função para criar as imagens das cartas */
async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

/* Função para jogar as cartas na batalha */
async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();

  await drawButton(duelResults);
}

/* Função para exibir o botão com o resultado da batalha */
async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

/* Função para atualizar o placar */
async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

/* Função para definir o vencedor da batalha */
async function checkDuelResults(playerCardID, ComputerCardID) {
  let duelResults = "draw";

  let playerCard = cardData[playerCardID];

  if (playerCard.WinOf.includes(ComputerCardID)) {
    duelResults = "win";
    await playAudio(duelResults);
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(ComputerCardID)) {
    duelResults = "lose";
    await playAudio(duelResults);
    state.score.computerScore++;
  }

  return duelResults;
}

/* Função para remover as cartas das mãos */
async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides;

  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

/* Função para exibir a carta selecionada */
async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

/* Função para sortear as cartas */
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

/* Função para resetar duelo */
async function resetDuel() {
  init();
}

/* Função para retornar o bloco de detalhes da carta ao seu padrão inicial */
async function hiddeCardDetails() {
  state.cardSprites.name.innerText = "Select";
  state.cardSprites.type.innerText = "your card";
  state.cardSprites.avatar.src = "";
}

/* Função para ocultar as cartas do duelo */
async function hiddeDuel() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  state.actions.button.style.display = "none";
}

/* Função para reproduzir áudio */
async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
  audio.volume = 0.2;
}

/* Função principal que chama o estado inicial do jogo */
function init() {
  const bgm = document.getElementById("bgm");
  bgm.play();
  bgm.volume = 0.5;

  hiddeCardDetails();
  hiddeDuel();
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);
}

init();
