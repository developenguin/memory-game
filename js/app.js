// ES5 is used for now to maintain compatibility across browsers
var cards = [];

function initializeNewGame() {

  // Make the list of cards
  cards = populateCardList();
  shuffle(cards);
  displayCardsOnScreen(cards);

}

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

  for (i = 0; i < symbols.length * 2; i++) {
    result.push({
      id: i,
      symbol: symbols[i % symbols.length],
      isOpen: false
    });
  }

  return result;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function displayCardsOnScreen(cards) {

  var $deck = $('.deck'),
      i;

  for (i = 0; i < cards.length; i++) {
    $deck.append(generateCard(cards[i]));
  }

}

function generateCard(card) {

  var $card = $('<li></li>').attr({
        'class': 'card',
        'id': card.id
      }),
      $icon = $('<i></i>').addClass('fa fa-' + card.symbol);

  $card.append($icon);
  console.log($card);

  return $card;

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