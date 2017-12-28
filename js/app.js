const gameState = {
  cards: [],
  openedCards: [],
  moves: 0,
  stars: 3,
  isHandlingMove: false
};

function initializeNewGame(options) {

  resetGameState();
  hideVictoryModal();

  displayCardsOnScreen(gameState.cards);
  updateStarRatingForGame();

  if (options && options.isFirstGame) {
    registerEventListeners();
  }

}

// For each card in the deck, append it to the deck
function displayCardsOnScreen(cards) {

  const $deck = $('.deck');

  for (let i = 0; i < cards.length; i++) {
    $deck.append(generateCard(cards[i]));
  }

}

// Generates the HTML for a card
function generateCard(card) {

  const $card = $('<li></li>').attr({
          'class': 'card',
          'id': card.id
        }),
        $icon = $('<i></i>').addClass('fa fa-' + card.symbol);

  $card.append($icon);

  return $card;

}

function registerEventListeners() {

  $('.deck').on('click', '.card', onClickCard);
  $('.restart').on('click', onClickRestart);

}

function onClickRestart() {
  initializeNewGame();
}

function onClickCard(evt) {

  const $clickedCard = $(evt.target);

  // When clicking on an open card, or if we are still handling
  // the previous click, don't do anything.
  if ($clickedCard.hasClass('.open') || gameState.isHandlingMove || isClickedCardAlreadyOpen($clickedCard)) {
    return;
  }

  // Else, open the card and if there are two open cards, process it as 'a move'
  openCard($clickedCard);
  gameState.openedCards.push($clickedCard);

  if (gameState.openedCards.length > 1) {
    handleMove();
  }

}

function handleMove() {

  // Prevent a click on any card from doing anything while we are busy here
  gameState.isHandlingMove = true;

  increaseMoveCounter();

  if (isOpenCardsMatch()) {

    // Set the styling and reset the openedCards list to prepare for next turn
    setMatchedForOpenedCards();
    gameState.openedCards = [];

    // Check if the game is won
    if (isAllCardsMatched()) {
      showVictoryModal();
    }

    gameState.isHandlingMove = false;

  } else {

    // Show the cards for a little while before closing them
    setTimeout(function() {
      closeCard(gameState.openedCards[0]);
      closeCard(gameState.openedCards[1]);

      gameState.openedCards = [];
      gameState.isHandlingMove = false;
    }, 500);

  }

  updateStarRatingForGame();

}

function increaseMoveCounter() {

  const $moves = $('.moves');

  gameState.moves++;

  $moves.text(gameState.moves);

}

function updateStarRatingForGame() {

  const $stars = $('.stars');

  determineStarRatingForGame();
  $stars.empty();

  for (let i = 0; i < gameState.stars; i++) {

    $stars.append(generateStar());

  }

}

function determineStarRatingForGame() {

  let rating = 3;

  if (gameState.moves >= 16) {
    rating = 2;
  }

  if (gameState.moves >= 20) {
    rating = 1;
  }

  gameState.stars = rating;

}

function generateStar(options) {

  const $li = $('<li></li>'),
        $starIcon = $('<i></i>').addClass('fa fa-star');

  if (options && options.isLargeIcon) {
    $starIcon.addClass('fa-3x');
  }

  $li.append($starIcon);

  return $li;

}

function isClickedCardAlreadyOpen($clickedCard) {

  // If this is the first card of a move, there is no match
  if (gameState.openedCards.length === 0) {
    return false;
  }

  const clickedCardId = $clickedCard.attr('id'),
        openCardId = gameState.openedCards[0].attr('id');

  return clickedCardId === openCardId;

}

function isOpenCardsMatch() {

  // Get the IDs of the opened cards and find their counterparts in the state
  const cardId1 = gameState.openedCards[0].attr('id'),
        cardId2 = gameState.openedCards[1].attr('id'),
        card1 = findCardById(parseInt(cardId1, 10)),
        card2 = findCardById(parseInt(cardId2, 10));

  // Check if the card symbols match.
  return (card1.symbol === card2.symbol);

}

function isAllCardsMatched() {

  // Loop over all cards and if any card is not matched return false.
  // Else all cards are matched, so return true
  for (let i = 0; i < gameState.cards.length; i++) {

    if (!gameState.cards[i].isMatched) {
      return false;
    }

  }

  return true;

}

function setMatchedForOpenedCards() {

  let cardId, i;

  // Update the DOM by setting the match class and update the state for tracking
  for (i = 0; i < gameState.openedCards.length; i++) {

    cardId = gameState.openedCards[i].attr('id');

    $('.card#' + cardId).addClass('match');
    findCardById(parseInt(cardId, 10)).isMatched = true;

  }

}

function openCard(card) {
  card.addClass('show open');
}

function closeCard(card) {
  card.removeClass('show open');
}

function findCardById(id) {

  let card, i;

  // Iterate over the cards array to get the on with the ID passed in.
  for (i = 0; i < gameState.cards.length; i++) {

    card = gameState.cards[i];

    if (card.id === id) {
      return card;
    }

  }

  // Make sure this never returns null
  return {};

}

// Show the final moves, stars etc.
function showVictoryModal() {

  const $stars = $('.star-rating');

  $('.final-moves').text(gameState.moves);

  for (let i = 0; i < gameState.stars; i++) {
    $stars.append(generateStar({isLargeIcon: true}));
  }

  $('#win-modal').removeClass('hidden');

}

function hideVictoryModal() {
  $('#win-modal').addClass('hidden');
}

function resetGameState() {

  $('.deck').empty();
  $('.star-rating').empty();

  // Make the list of cards and shuffle it
  gameState.cards = populateCardList();
  shuffleCards(gameState.cards);

  // Reset opened cards, moves and stars
  gameState.openedCards = [];
  gameState.moves = 0;
  gameState.stars = 3;

  $('.moves').text(gameState.moves);

}

// Add two cards of each symbol to the list of cards
function populateCardList() {

  const symbols = [
          'diamond',
          'paper-plane-o',
          'anchor',
          'bolt',
          'cube',
          'leaf',
          'bicycle',
          'bomb'
        ],
        result = [];

  // Make sure we get two of each symbol, mod operator is used to make sure
  // that we only get existing symbols.
  for (let i = 0; i < symbols.length * 2; i++) {
    result.push({
      id: i,
      symbol: symbols[i % symbols.length],
      isMatched: false
    });
  }

  return result;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffleCards(array) {
  let currentIndex = array.length,
      temporaryValue,
      randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;

}

initializeNewGame({isFirstGame: true});