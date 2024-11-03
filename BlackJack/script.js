const deck = [];
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let playerHand = [];
let dealerHand = [];
let playerHands = [[]];
let currentHandIndex = 0;
let playerChips = 100;
let betAmount = 0;
let isGameOver = false;
let dealerHiddenCard = true;
let insuranceBet = 0;

const playerHandDiv = document.getElementById('player-hand');
const dealerHandDiv = document.getElementById('dealer-hand');
const chipsDisplay = document.getElementById('chips');
const messageDisplay = document.getElementById('message');
const insureButton = document.getElementById('insure-button');
const declineInsuranceButton = document.getElementById('decline-insurance-button');

document.getElementById('bet-button').addEventListener('click', placeBet);
document.getElementById('hit-button').addEventListener('click', playerHit);
document.getElementById('stand-button').addEventListener('click', playerStand);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('split-button').addEventListener('click', splitHand);
insureButton.addEventListener('click', takeInsurance);
declineInsuranceButton.addEventListener('click', declineInsurance);

function initDeck() {
    deck.length = 0;
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard(hand) {
    if (deck.length === 0) {
        initDeck();
    }
    const card = deck.pop();
    hand.push(card);
}

function renderHand(hand, handDiv, isDealer = false) {
    handDiv.innerHTML = '';

    hand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        
        if (isDealer && index === 1 && dealerHiddenCard) {
            cardDiv.classList.add('hidden');
            cardDiv.textContent = 'Hidden';
        } else {
            cardDiv.textContent = `${card.value} ${card.suit}`;
            cardDiv.classList.add((card.suit === '♥' || card.suit === '♦') ? 'red' : 'black');
        }
        
        handDiv.appendChild(cardDiv);
    });
}

function calculateHandValue(hand) {
    let value = 0;
    let hasAce = false;

    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.value)) value += 10;
        else if (card.value === 'A') {
            value += 11;
            hasAce = true;
        } else value += parseInt(card.value);
    });

    if (value > 21 && hasAce) value -= 10;
    return value;
}

function placeBet() {
    const betInput = document.getElementById('bet-amount').value;
    betAmount = parseInt(betInput);

    if (betAmount > playerChips || betAmount <= 0) {
        setMessage('Ungültige Wettmenge');
        return;
    }

    playerChips -= betAmount;
    chipsDisplay.textContent = playerChips;

    document.getElementById('bet-button').disabled = true;

    startGame();
}

function startGame() {
    isGameOver = false;

    initDeck();

    playerHand = [];
    dealerHand = [];
    dealerHiddenCard = true;
    insuranceBet = 0;

    playerHands = [[]];
    currentHandIndex = 0;

    dealCard(playerHands[0]);
    dealCard(playerHands[0]);
    dealCard(dealerHand);
    dealCard(dealerHand);

    renderHand(playerHands[0], playerHandDiv);
    renderHand(dealerHand, dealerHandDiv, true);

    const playerHandValue = calculateHandValue(playerHands[0]);
    const dealerHandValue = calculateHandValue(dealerHand);

    if (dealerHandValue === 21 && dealerHand[1].value === 'A') {
        dealerHiddenCard = false;
        renderHand(dealerHand, dealerHandDiv);

        setMessage('Dealer hat Blackjack! Dealer gewinnt.');
        endGame();
        return;
    }

    if (playerHandValue === 21) {
        setMessage('Blackjack! Du gewinnst!');
        playerChips += betAmount * 2.5;
        chipsDisplay.textContent = playerChips;
        endGame();
        return;
    }

    if (dealerHand[0].value === 'A') {
        insureButton.disabled = false;
        declineInsuranceButton.disabled = false;
        setMessage('Dealer zeigt ein Ass. Möchtest du versichern?');
    } else {
        setMessage('Dein Zug!');
        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;
        if (canSplit(playerHands[0])) {
            document.getElementById('split-button').disabled = false;
        }
    }
}

function takeInsurance() {
    let insuranceBet = Math.floor(betAmount / 2);

    if (insuranceBet > playerChips) {
        setMessage('Nicht genug Chips fürs Versichern.');
        return;
    }

    playerChips -= insuranceBet;
    chipsDisplay.textContent = playerChips;

    insureButton.disabled = true;

    if (checkDealerBlackjack()) {
        dealerHiddenCard = false;
        renderHand(dealerHand, dealerHandDiv);

        playerChips += insuranceBet * 2;
        chipsDisplay.textContent = playerChips;

        setMessage('Dealer hat Blackjack! Du gewinnst die Versicherungswette, verlierst aber die Hauptwette.');
        endGame();
    } else {
        setMessage('Dealer does not have Blackjack. You lose the insurance bet.');

        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;

        insuranceBet = 0;
    }
}

function declineInsurance() {
    setMessage('Du hast Versichern abgelehnt.');

    insureButton.disabled = true;
    declineInsuranceButton.disabled = true;

    if (checkDealerBlackjack()) {
        dealerHiddenCard = false;
        renderHand(dealerHand, dealerHandDiv);

        setMessage('Dealer hat Blackjack!');
        endGame();
    } else {
        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;
    }
}

function checkDealerBlackjack() {
    const faceDownCard = dealerHand[1];
    return dealerHand[0].value === 'A' && ['10', 'J', 'Q', 'K'].includes(faceDownCard.value);
}

function playerHit() {
    if (isGameOver) return;
    dealCard(playerHands[currentHandIndex]);
    renderHand(playerHands[currentHandIndex], playerHandDiv);
    const handValue = calculateHandValue(playerHands[currentHandIndex]);
    if (handValue > 21) {
        setMessage('Überkauft!');
        moveToNextHand();
    } else if (handValue === 21) {
        setMessage('Du hast 21!');
        moveToNextHand();
    }
}

function playerStand() {
    moveToNextHand();
}

function moveToNextHand() {
    currentHandIndex++;
    if (currentHandIndex < playerHands.length) {
        setMessage(`Aktuelle hand ${currentHandIndex + 1}`);
        renderHand(playerHands[currentHandIndex], playerHandDiv);
        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;
    } else {
        dealerPlays();
    }
}

function canSplit(hand) {
    return hand.length === 2 && hand[0].value === hand[1].value;
}

function splitHand() {
    if (!canSplit(playerHands[currentHandIndex])) {
        setMessage('Du kannst diese Hand nicht teilen.');
        return;
    }

    if (playerChips < betAmount) {
        setMessage('Nicht Genug Chips zum teien.');
        return;
    }

    playerChips -= betAmount;
    chipsDisplay.textContent = playerChips;

    const secondHand = [playerHands[currentHandIndex].pop()];
    playerHands.push(secondHand);
    dealCard(playerHands[currentHandIndex]);
    dealCard(playerHands[currentHandIndex + 1]);

    renderHand(playerHands[currentHandIndex], playerHandDiv);
    setMessage('Hand geteilt. Spiele Hand 1.');

    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('split-button').disabled = true;
}

function dealerPlays() {
    dealerHiddenCard = false;
    renderHand(dealerHand, dealerHandDiv);

    while (calculateHandValue(dealerHand) < 17) {
        dealCard(dealerHand);
        renderHand(dealerHand, dealerHandDiv);
    }

    const dealerValue = calculateHandValue(dealerHand);

    playerHands.forEach((hand, index) => {
        const playerValue = calculateHandValue(hand);
        let resultMessage = `Hand ${index + 1}: `;

        if (playerValue > 21) {
            resultMessage += 'Überkauft!';
        } else if (dealerValue > 21) {
            resultMessage += 'Dealer überkauft. Du gewinnst!';
            playerChips += betAmount * 2;
        } else if (playerValue > dealerValue) {
            resultMessage += 'Du gewinnst!';
            playerChips += betAmount * 2;
        } else if (playerValue === dealerValue) {
            resultMessage += 'Unentschieden!';
            playerChips += betAmount;
        } else {
            resultMessage += 'Dealer gewinnt.';
        }

        setMessage(resultMessage);
    });

    endGame();
}

function endGame() {
    isGameOver = true;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('bet-button').disabled = false;
    document.getElementById('split-button').disabled = true;
    insureButton.disabled = true;
    declineInsuranceButton.disabled = true;
    chipsDisplay.textContent = playerChips;
}

function restartGame() {
    playerChips = 100;
    chipsDisplay.textContent = playerChips;
    setMessage('Spiel Neugestartet. Platziere deine Wette');
    playerHand = [];
    dealerHand = [];
    playerHands = [[]];
    currentHandIndex = 0;
    renderHand(playerHand, playerHandDiv);
    renderHand(dealerHand, dealerHandDiv);
    document.getElementById('bet-button').disabled = false;
    insureButton.disabled = true;
    isGameOver = false;
}

function setMessage(msg) {
    messageDisplay.textContent = msg;
}

setMessage('Wette setzen zum Starten');
insureButton.disabled = true;
declineInsuranceButton.disabled = true;
