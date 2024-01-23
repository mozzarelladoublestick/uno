const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

const drawPile = [];
const discardPile = [];

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

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  users.push(socket.id);
  console.log(users);
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
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
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
