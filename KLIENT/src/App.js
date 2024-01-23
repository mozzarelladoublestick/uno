import socketIO from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('yello');
  const [users, setUsers] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [illegal, setIllegal] =useState("")
  let isFirstCard = true;
  useEffect(() => {
    socket.on('login', (data) => setUsers((prevUsers) => [...prevUsers, data.text]));
    socket.on('yourCards', (data) => {
      const cardsString = data.cards;
      const cards = cardsString.split(',');

      cards.forEach((cardText) => {
        let contents = cardText.split(' ');
        let cardColor = contents[0];
        let cardNumber = contents[1];
        addCard(cardNumber, cardColor);

      });
    });
    socket.on('movedToDiscardPile', (data)=>{
      movedCardToDiscardPile(data.cardColor, data.cardNumber);
    });
    socket.on('illegalMove',() =>  {
  setIllegal("you cannot do this. only move card same color or same number ok thank u");
    });
  }, []);

  function startGame() {
    console.log("sent message");
    socket.emit('start', {
      text: message, // Use 'text' instead of 'message'
      socketID: socket.id,
    });
  }

  function addCard(cardNumber, cardColor) {
    const card = document.createElement("div");

    console.log(cardNumber);
    console.log(cardColor);
    card.textContent = cardNumber;
    card.className = `card ${cardColor}`;
    card.onclick = () => {
      setIllegal("");
      socket.emit('moveToDiscardPile',{
        cardNumber: cardNumber,
        cardColor: cardColor,
        socketID: socket.id
      });
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

  function movedCardToDiscardPile(cardColor, cardNumber) {
    const discardPileContainer = document.getElementById("discardPile");
    const discardedCard = document.createElement("div");
    discardedCard.textContent = cardNumber;
  
    console.log(cardNumber);
    discardedCard.className = `card discard-pile-card ${cardColor}`;
    discardPileContainer.appendChild(discardedCard);
  
    if (!isFirstCard) {
  
      const handCards = document.getElementsByClassName("card");
  
      for (let i = 0; i < handCards.length; i++) {
        const handCard = handCards[i];
        console.log(handCard);
       if (handCard.textContent === discardedCard.textContent && handCard.className.split(" ")[1] === discardedCard.className.split(" ")[2]) {
          handCard.remove();
          break; // Assuming there is only one matching card in the hand
        }
      }
      
    }
    isFirstCard = false;
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
      <div id="discardPile"></div>
  <div id="handCards"></div>
  <h4>{illegal}</h4>
      <button onClick={dealCards}>give me my cards</button>
    </div>
  );
}

export default App;
