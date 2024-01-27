const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

const drawPile = [];
const discardPile = [];

let currentPlayer = null;

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

let deck = [];
let users = [];

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
function isMoveLegal(cardColor, cardNumber, card2) {
  let card1 = cardColor + " " + cardNumber;
  const [color1, number1] = card1.split(" ");
  const [color2, number2] = card2.split(" ");

  // Check if the colors match or the numbers match
  return color1 === color2 || number1 === number2;
}


socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  users.push(socket.id);
  console.log(users);

  // Initialisierung des aktuellen Spielers
  if (currentPlayer === null) {
    currentPlayer = socket.id;
    console.log("currentPlayer: " + currentPlayer);
  }

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    // Entferne den Benutzer aus der Liste
    users = users.filter(user => user !== socket.id);
    console.log(users);

    // Wenn der ausgeschiedene Spieler der aktuelle Spieler ist, aktualisiere den aktuellen Spieler
    if (currentPlayer === socket.id) {
      currentPlayer = (users.length > 0) ? users[0] : null;

      // Sende eine Nachricht an alle Clients, um den aktuellen Spieler zu aktualisieren
      socketIO.emit('updateCurrentPlayer', { currentPlayer: currentPlayer });
    }
  });


  socket.on('login', (data) => {
    console.log(data.username);
    socketIO.emit('login', {
      username: data.username,
      text: data.username + " " + "joined"
    });
  });

  socket.on('dealCards', () => {
    if (deck.length === 0) {
      const colors = ['red', 'blue', 'green', 'yellow'];
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      deck = [];

      // Create Uno deck with cards of different colors and numbers
      for (const color of colors) {
        for (const number of numbers) {
          deck.push(`${color} ${number}`);
        }
      }

      shuffleDeck();
      /* users.forEach(user => {
         const playerCards = deck.splice(0, 7);
         //socketIO.to(user).emit('yourCards', { cards: playerCards.join(',') }); fix thos
         
       });*/

    }

    // Deal 7 cards to each player
    const playerCards = deck.splice(0, 7);
    socketIO.to(socket.id).emit('yourCards', { cards: playerCards.join(',') });
  });

  socket.on('drawCard', () => {
    if (deck.length === 0) {
      socket.emit('noMoreCards');
    } else {
      const card = deck.pop();
      socketIO.to(socket.id).emit('drawCard', { card: card });
    }
  });
  socket.on('endGame', (data)=>{
    console.log("kleiner")
    socketIO.emit('endGame', {
      username: data.username,
      socketID: data.socketID
    })
  })

  socket.on('moveToDiscardPile', (data) => {

    // Überprüfe, ob der Spieler an der Reihe ist
    if (socket.id !== currentPlayer) {
      socket.emit('notYourTurn');
      console.log("not your turn");
      console.log("currentPlayer: " + currentPlayer);
      return;
    }

    const cardNumber = data.cardNumber;
    const cardColor = data.cardColor;
    const lastCardOnDiscardPile = discardPile[discardPile.length - 1];
    // Check if the move is legal according to Uno rules
    if (!lastCardOnDiscardPile || isMoveLegal(cardNumber, cardColor, lastCardOnDiscardPile)) {
      let cardText = cardNumber + " " + cardColor;
      discardPile.push(cardText);
      socketIO.emit('movedToDiscardPile', {
        cardNumber: cardNumber,
        cardColor: cardColor
      });

      // Aktualisiere den aktuellen Spieler für den nächsten Zug
      currentPlayer = (currentPlayer === users[0]) ? users[1] : users[0];

      // Sende eine Nachricht an alle Clients, um den aktuellen Spieler zu aktualisieren
      socketIO.emit('updateCurrentPlayer', { currentPlayer: currentPlayer });
    } else {
      socket.emit('illegalMove');
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
