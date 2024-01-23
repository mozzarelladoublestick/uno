import socketIO from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('yello');
  const [users, setUsers] = useState([]);
  const [handCards, setHandCards] = useState([]);

  useEffect(() => {
    socket.on('login', (data) => setUsers((prevUsers) => [...prevUsers, data.text]));
    socket.on('yourCards', (data) => {
      const cardsString = data.cards;
      const cards = cardsString.split(',');

      cards.forEach((cardText) => {
        const color = cardText.split(" ")[0]; // Extract color from cardText
        addCard(cardText, color);
      });
    });
  }, []);

  function startGame() {
    console.log("sent message");
    socket.emit('start', {
      text: message, // Use 'text' instead of 'message'
      socketID: socket.id,
    });
  }

  function addCard(cardText, color) {
    const card = document.createElement("div");
    card.textContent = cardText.split(" ")[1];
    card.className = `card ${color}`;
    card.onclick = () => {
      socket.emit(`moveToDiscardPile:${cardText}`);
    };
    const handCards = document.getElementById('handCards');
    handCards.appendChild(card);
  }

  function dealCards() {
    socket.emit('dealCards');
  }

  const [username, setUsername] = useState('');

  function login() {
    socket.emit('login', {
      username: username,
      socketID: socket.id
    });
  }

  return (
    <div>
      <h2>Login</h2>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <button onClick={login}>start game</button>
      <h2>Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
  <div id="handCards"></div>
      <button onClick={dealCards}>give me my cards</button>
    </div>
  );
}

export default App;
