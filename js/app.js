const gameState = {
  cards: [],
  openedCards: [],
  moves: 0,
  stars: 3,
  isHandlingMove: false,
  gameStartTime: null,
  timePlayed: null,
  timer: null
};

/*
 * Set up everything needed for a new game to start. If it's the first game
 * of the session, register event handlers to respond to clicks
 */
function initializeNewGame(options) {

  resetGameState();
  hideVictoryModal();

  displayCardsOnScreen(gameState.cards);
  updateStarRatingForGame();
  displayTimeInGameHeader('00:00:00');

  if (options && options.isFirstGame) {
    registerEventListeners();
  }

}

/*
 * Appends a list of card elements to the DOM
 */
function displayCardsOnScreen(cards) {

  const $deck = $('.deck');

  for (let i = 0; i < cards.length; i++) {
    $deck.append(generateCard(cards[i]));
  }

}

/*
 * Generates the necessary HTML for displaying a card on the screen
 */
function generateCard(card) {

  const $card = $('<li></li>').attr({
          'class': 'card',
          'id': card.id
        }),
        $icon = $('<i></i>').addClass('fa fa-' + card.symbol);

  $card.append($icon);

  return $card;

}

/*
 * Register event handlers for interactivity
 */
function registerEventListeners() {

  $('.deck').on('click', '.card', onClickCard);
  $('.restart').on('click', onClickRestart);

}

/*
 * Event handler for the restart button. Stops the timer and starts a new game
 */
function onClickRestart() {
  stopTimer();
  initializeNewGame();
}

/*
 * Event handler for a card click. This calls the necessary functions to
 * process a move
 */
function onClickCard(evt) {

  const $clickedCard = $(evt.target);

  // When clicking on any already open card, or if we are still handling
  // the previous click, don't do anything.
  if (isClickingOnOpenCard($clickedCard)
    || isClickingOnSameCard($clickedCard)
    || gameState.isHandlingMove) {
    return;
  }

  startGameTimerIfNotExisting();

  // Open the card and if there are two open cards, process it as 'a move'
  openCard($clickedCard);
  gameState.openedCards.push($clickedCard);

  if (gameState.openedCards.length > 1) {
    handleMove();
  }

}

/*
 * Do everything needed to process a move (i.e. two consecutive clicks on
 * different cards).
 * - Block the game from processing user inputs
 * - Match cards
 * - Check if the game is won or not
 */
function handleMove() {

  // Prevent a click on any card from doing anything while we are busy here
  gameState.isHandlingMove = true;

  increaseMoveCounter();

  if (isOpenCardsMatch()) {

    // Set the styling and reset the openedCards list to prepare for next turn
    setMatchedForOpenedCards();
    gameState.openedCards = [];

    // If the game is won, stop the time and show the win message
    if (isAllCardsMatched()) {
      stopTimer();
      updateVictoryModal();
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

/*
 * Increase the move counter on screen
 */
function increaseMoveCounter() {

  const $moves = $('.moves');

  gameState.moves++;

  $moves.text(gameState.moves);

}

/*
 * Update the star rating on screen
 */
function updateStarRatingForGame() {

  const $stars = $('.stars');

  determineStarRatingForGame();
  $stars.empty();

  for (let i = 0; i < gameState.stars; i++) {

    $stars.append(generateStar());

  }

}

/*
 * Determine how many stars the game is worth, based on the amount of moves
 */
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

/*
 * Generate the HTML for a star icon
 */
function generateStar(options) {

  const $li = $('<li></li>'),
        $starIcon = $('<i></i>').addClass('fa fa-star');

  if (options && options.isLargeIcon) {
    $starIcon.addClass('fa-3x');
  }

  $li.append($starIcon);

  return $li;

}

/*
 * Check if the clicked card is open
 */
function isClickingOnOpenCard($clickedCard) {
  return $clickedCard.hasClass('open');
}

/*
 * Check if the clicked card was already clicked within the same turn
 */
function isClickingOnSameCard($clickedCard) {

  // If this is the first card of a move, there is no 'same card' to click
  if (gameState.openedCards.length === 0) {
    return false;
  }

  const clickedCardId = $clickedCard.attr('id'),
        openCardId = gameState.openedCards[0].attr('id');

  return clickedCardId === openCardId;

}

/*
 * Check if the currently opened cards are matched by comparing their symbols
 */
function isOpenCardsMatch() {

  // Get the IDs of the opened cards and find their counterparts in the state
  const cardId1 = gameState.openedCards[0].attr('id'),
        cardId2 = gameState.openedCards[1].attr('id'),
        card1 = findCardById(parseInt(cardId1, 10)),
        card2 = findCardById(parseInt(cardId2, 10));

  return (card1.symbol === card2.symbol);

}

/*
 * Check if all cards on the board are matched to another card
 */
function isAllCardsMatched() {

  // If any card is not matched, break out of the loop
  for (let i = 0; i < gameState.cards.length; i++) {

    if (!gameState.cards[i].isMatched) {
      return false;
    }

  }

  return true;

}

/*
 * If there is no timer in the game state, start one by recording the current
 * time and setting the update interval
 */
function startGameTimerIfNotExisting() {

  if (!gameState.gameStartTime) {

    gameState.gameStartTime = new Date().getTime();
    gameState.timer = setInterval(updateTime, 1000);

  }

}

/*
 * This is a timer function which takes the current time and calculates
 * how long the game is taking compared to the start time
 */
function updateTime() {

  const now = new Date().getTime();

  gameState.timePlayed = now - gameState.gameStartTime;

  displayTimeInGameHeader(
    formatTime(gameState.timePlayed)
  );

}

/*
 * Takes a time and formats it to a HH:mm:ss string
 */
function formatTime(time) {

  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)),
        secs = Math.floor((time % (1000 * 60)) / 1000);

  return `${ _.padStart(hours, 2, '0') }:${ _.padStart(mins, 2, '0') }:${ _.padStart(secs, 2, '0') }`; //eslint-disable-line

}

/*
 * takes the a formatted time string and displays it on the screen
 */
function displayTimeInGameHeader(formattedTimeString) {
  $('.time-played').text(formattedTimeString);
}

/*
 * Stops the timer
 */
function stopTimer() {
  clearInterval(gameState.timer);
}

/*
 * For all opened cards, set them to matched in the DOM and game state
 */
function setMatchedForOpenedCards() {

  let cardId, i;

  for (i = 0; i < gameState.openedCards.length; i++) {

    cardId = gameState.openedCards[i].attr('id');

    $('.card#' + cardId).addClass('match');
    findCardById(parseInt(cardId, 10)).isMatched = true;

  }

}

/*
 * Open a card
 */
function openCard(card) {
  card.addClass('show open');
}

/*
 * Close a card
 */
function closeCard(card) {
  card.removeClass('show open');
}

/*
 * returns the card with the given ID from the game state
 */
function findCardById(id) {
  return _.find(gameState.cards, {id}) || {};
}

/*
 * Prepare the victory modal for showing by inserting all the latest info
 */
function updateVictoryModal() {

  const $stars = $('.star-rating');

  $('.final-moves').text(gameState.moves);
  $('.total-time').text(formatTime(gameState.timePlayed));

  for (let i = 0; i < gameState.stars; i++) {
    $stars.append(generateStar({isLargeIcon: true}));
  }

}

/*
 * Show a modal with the final time, stars etc.
 */
function showVictoryModal() {
  $('#win-modal').removeClass('hidden');
}

/*
 * hide the victory modal
 */
function hideVictoryModal() {
  $('#win-modal').addClass('hidden');
}

/*
 * Prepare the game state for the next game
 */
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
  gameState.timer = null;
  gameState.gameStartTime = null;
  gameState.timePlayed = null;

  $('.moves').text(gameState.moves);

}

/*
 * Returns a list of cards containing two cards of each symbol
 */
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

  // mod operator is used to make sure we only get existing symbols.
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

// Start the first game of the session
initializeNewGame({isFirstGame: true});
