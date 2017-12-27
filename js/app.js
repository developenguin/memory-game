/* global $ */
// ES5 is used for now to maintain compatibility across browsers

var gameState = {
  cards: [],
  openedCards: []
};

function initializeNewGame() {

  // Make, shuffle and display the list of cards
  gameState.cards = populateCardList();

  shuffle(gameState.cards);
  displayCardsOnScreen(gameState.cards);
  registerEventListeners();

}

// Add two cards of each symbol to the list of cards
function populateCardList() {

  var symbols = [
        'diamond',
        'paper-plane-o',
        'anchor',
        'bolt',
        'cube',
        'leaf',
        'bicycle',
        'bomb'
      ],
      result = [],
      i;

  // Make sure we get two of each symbol, mod operator is used to make sure
  // that we only get existing symbols.
  for (i = 0; i < symbols.length * 2; i++) {
    result.push({
      id: i,
      symbol: symbols[i % symbols.length]
    });
  }

  return result;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
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

// For each card in the deck, append it to the deck
function displayCardsOnScreen(cards) {

  var $deck = $('.deck'),
      i;

  for (i = 0; i < cards.length; i++) {
    $deck.append(generateCard(cards[i]));
  }

}

// Generates the HTML for a card
function generateCard(card) {

  var $card = $('<li></li>').attr({
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

  $('.deck').empty();
  initializeNewGame();

}

function onClickCard(evt) {

  var $clickedCard = $(evt.target);

  openCard($clickedCard);
  gameState.openedCards.push($clickedCard);

  if (gameState.openedCards.length > 1) {
    handleMove();
  }

}

function handleMove() {

  increaseMoveCounter();

  if (isOpenCardsMatch()) {

  }

}

function increaseMoveCounter() {

}

function isOpenCardsMatch() {

  // Get the IDs of the opened cards and find their counterparts in the state
  var cardId1 = gameState.openedCards[0].attr('id'),
      cardId2 = gameState.openedCards[1].attr('id'),
      card1 = findCardById(parseInt(cardId1, 10)),
      card2 = findCardById(parseInt(cardId2, 10));

  // Check if the cards match.
  return (card1.symbol === card2.symbol);

}

function openCard(card) {
  card.addClass('show open');
}

function closeCard(card) {
  card.removeClass('show open');
}

function findCardById(id) {

  var card, i;

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

initializeNewGame();