
/* 
Game is in working condition. The deck doesn't reshuffle after all the cards have been drawn, so I'm sure it's
possible to have no winner.
*/
var win = false;	


function Deck() {
	this.cards = [];							  					// Using the this.cards array as a stack (push and pop methods)
	this.discard = [];							  				// Using the this.discard array as a stack
	this.count = function(){
		return this.cards.length;
	}
	this.init = function() {                	// This function fills the array "this.cards" with 52 instances 
		for (s = 1; s <= 4; s++) { 							// of the Card object. It labels the suits and face cards.
			for (r = 1; r <= 13; r++) {			   
				this.cards.push(new Card(r, s));  
			}
		}
		_.map(this.cards, function(crd) {
			if (crd.suit === 1) {
				crd.suit = "h";
			}
			else if (crd.suit === 2) {
				crd.suit = "d";
			}
			else if (crd.suit === 3) {
				crd.suit = "s";
			}
			else if (crd.suit === 4) {
				crd.suit = "c";
			}
			if (crd.rank === 1) {
				crd.rank = "A";
			}
			else if (crd.rank === 10) {
				crd.rank = "T";
			}
			else if (crd.rank === 11) {
				crd.rank = "J";
			}
			else if (crd.rank === 12) {
				crd.rank = "Q";
			}
			else if (crd.rank === 13) {
				crd.rank = "K";
			}
		})
	}
	this.firstFlip = function() {				    	// This flips the top card from the deck to the discard pile to 
		this.discard.push(this.cards.pop());		// start the game.		  
	}
	this.shuffle = function(shoe) {						// Shuffles the card objects within the deck array.      
		for (var i = shoe.length - 1; i > 0; i--) {        
    		var j = Math.floor(Math.random() * (i + 1));   
    		var temp = shoe[i];
    		shoe[i] = shoe[j];
    		shoe[j] = temp;
	    }
    	this.cards = shoe;
	}
}

function Card(rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.show = function() {
		console.log(this.rank + this.suit);
	}
}

function Player(playerNumber) {
	this.playerName = "Player " + playerNumber;
	this.hand = [];
	this.showHand = function() {
		fullHand = [];
		_.map(this.hand, function(card) {
			fullHand.push(card.rank + card.suit);
		})
		return fullHand;
	}
}

function CrazyEights() {
	this.playableRank;
	this.playableSuit;
	this.howManyPlayers;
	this.statRound = 1;
	this.statEight = 0;
	this.playerList = [];
	this.playerSetup = function() {						// This function generates the player objects for the game.
		this.howManyPlayers = parseInt(prompt("How many players? (1-4)"));
		while (this.howManyPlayers < 1 || this.howManyPlayers > 4) {
			this.howManyPlayers = parseInt(prompt("How many players? (1-4)"));
		}
		for (i = 1; i < this.howManyPlayers + 1; i++) {  
				this.playerList.push(new Player(i));
		}
	}
	this.deal = function(gameDeck) {
		for (i = 1; i < 8; i++) {								// This function deals a hand of 7 cards to each player.
			for (j = 0; j < this.howManyPlayers; j++) {  
				this.playerList[j].hand.push(gameDeck.pop());
			}
		}
	}
	this.eight = function() {									// This will be used to set the suit when an 8 is played.
		this.statEight++;
		suitPick = prompt("Pick a suit (h, d, s, c):");
		while (suitPick != "h" && suitPick != "d" && suitPick != "s" && suitPick != "c"){
			suitPick = prompt("Pick a suit (h, d, s, c):");
		}
		return suitPick;
	}

	// The following function is the core of the actual game.
	// The inputs in order are: current player obj, the discard array, the deck count, the deck array
	this.turn = function(curPlayer, curDiscard, cardsRemain, curDeck) {
		alert(curPlayer.playerName + " it's your turn!");  
		this.playableRank = curDiscard[curDiscard.length - 1].rank;			   
		this.playableSuit = curDiscard[curDiscard.length - 1].suit;
		this.pickCard = prompt(
			"Cards left in the deck: " + cardsRemain + "\n\n" +
			"Last card discarded: " + curDiscard[curDiscard.length - 1].rank + curDiscard[curDiscard.length - 1].suit + "\n" +
			"Your hand: " + curPlayer.showHand() + "\n\n" +
			"Choose a card to discard, enter \"d\" to draw a new card, or enter \"p\" to pass your turn:"
			)
		this.guessRank = this.pickCard.charAt(0);
		this.guessSuit = this.pickCard.charAt(1);
		this.findInHand = function() {					// Finds a card in the player's hand and returns its index
			handPosition = -1;
			for (i = 0; i < curPlayer.hand.length; i++) {
				if (this.guessRank == curPlayer.hand[i].rank && this.guessSuit == curPlayer.hand[i].suit) {
					handPosition = i;
				}
			}
			return handPosition;
		}
		this.playCard = function() {						// Handles the movement of cards, checks for 8s, and victory conditions
			if (this.guessRank == 8) {
				curDiscard.push(new Card(this.guessRank, this.eight()));
			}
			else {
				curDiscard.push(new Card(this.guessRank, this.guessSuit));
			}
			this.playableRank = curDiscard[curDiscard.length - 1].rank; 
			this.playableSuit = curDiscard[curDiscard.length - 1].suit;
			curPlayer.hand.splice(this.findInHand(), 1);
			if (curPlayer.hand.length == 0) {
				alert("Congratulations " + curPlayer.playerName + "!  You win!");
				win = true;
				$("#statbox").
					append("<li>" + curPlayer.playerName + " was the winner!</li>" +
						"<li>The game ended on round " + this.statRound + ".</li>" +
						"<li>There was(were) " + this.statEight + " eight(s) played.</li>");
			}
			else {
				alert("You have " + curPlayer.hand.length + " cards left \n" + curPlayer.showHand()); 
			}
		}

		if (this.pickCard == "d" && curDeck.length != 0) {            
			curPlayer.hand.push(curDeck.pop());
			alert("You have " + curPlayer.hand.length + " cards left \n" + curPlayer.showHand()); 
		}
		else if (this.pickCard == "p") {
			alert("You have " + curPlayer.hand.length + " cards left \n" + curPlayer.showHand()); 
		}
		else if (this.findInHand() != -1 &&      					
			(this.guessRank == 8 || this.guessRank == this.playableRank || this.guessSuit == this.playableSuit)) {
			this.playCard();											
		}
		else {
			alert("Oops, try again!");
			this.turn(curPlayer, curDiscard, cardsRemain, curDeck);
		}		
	}
}


var playGame = function() {
	alert("Welcome to the Crazy Eights game! \n\nYou can play any card from your hand with the same rank or suit as" + 
	" the last card discarded. Eights are wild cards and may be played any time. \n\nTo play a card enter it exactly" +
	" as shown, with a number or uppercase letter for rank and lowercase letter for suit.");
	
	d = new Deck();							// Create deck obj
	d.init();										// Fill the deck with card objects
	d.shuffle(d.cards);					// Shuffle the cards in the deck
	d.firstFlip();							// Move the top card to the discard pile (would be after the deal irl)
	
	g = new CrazyEights();			// Create game obj
	g.playerSetup();						// Prompts for and creates appropriate number of Player objects
	g.deal(d.cards);						// Deals a starting hand of 7 cards to each player
	

	//The following loops run the turn method through the player list while checking for victory condition to break the
	//loop before each turn.
	while (win != true) {			
		for (z = 0; z < g.playerList.length; z++) {
			if (win == true) {
				break;
			}
			g.turn(g.playerList[z], d.discard, d.count(), d.cards); //One turn of the game
		}
		g.statRound++;
	}
}

$("#playme").on("click", playGame);

