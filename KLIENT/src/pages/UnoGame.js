import socketIO from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import LogoutButton from '../compontents/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, BrowserRouter as Router } from "react-router-dom";
const socket = socketIO.connect('http://localhost:4000');

function UnoGame() {
  const { isAuthenticated } = useAuth0();
  const [message, setMessage] = useState();
  const [users, setUsers] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [illegal, setIllegal] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const [username, setUsername] = useState('');
  let isFirstCard = true;
  useEffect(() => {
    socket.on('login', (data) => {
      setUsers((prevUsers) => [...prevUsers, data.text])
      setUsername(data.text);
      console.log(username);

    });

    socket.on('notEnoughPlayers', () => {
      setIllegal("not enough players");
    });

    socket.on('notYourTurn', () => {
      setIllegal("it is not your turn");
    });

    socket.on('updateCurrentPlayer', (data) => {
      setCurrentPlayer(data.currentPlayer);
    });

    socket.on('yourCards', (data) => {
      const cardsString = data.cards;
      const cards = cardsString.split(',');
      const handcardButton = document.getElementById('handcard-button');
      handcardButton.className = "hide";
      cards.forEach((cardText) => {
        let contents = cardText.split(' ');
        let cardColor = contents[0];
        let cardNumber = contents[1];
        addCard(cardNumber, cardColor);
      });

    });
    socket.on('drawCard', (data) => {
      const cardText = data.card;
      let contents = cardText.split(' ');
      let cardColor = contents[0];
      let cardNumber = contents[1];
      addCard(cardNumber, cardColor);
    });
    socket.on('movedToDiscardPile', (data) => {
      movedCardToDiscardPile(data.cardColor, data.cardNumber);
    });
    socket.on('illegalMove', () => {
      setIllegal("you cannot do this. only move card same color or same number ok thank u");
    });
    socket.on('endGame', (data) => {
      setMessage("game has ended");
      document.getElementById("game").className = "hide";
    })
    return () => {
      // Clean up event listeners when the component is unmounted
      socket.off('login');
      socket.off('notEnoughPlayers');
      socket.off('yourCards');
      socket.off('movedToDiscardPile');
      socket.off('illegalMove');
      socket.off('drawCard')
      socket.off('connection');
      socket.off('disonnect')
      socket.off('updateCurrentPlayer');
      socket.off('notYourTurn');
      // Remove other event listenes here
    };
  }, []);

  function startGame() {
    console.log("sent message");
    socket.emit('start', {
      text: message,
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
      socket.emit('moveToDiscardPile', {
        cardNumber: cardNumber,
        cardColor: cardColor,
        socketID: socket.id
      });
    };
    const handCards = document.getElementById('handCards');
    handCards.appendChild(card);
    console.log(handCards.children.length);
  }

  function dealCards() {
    socket.emit('dealCards');

  }

  function drawCard() {
    if (socket.id !== currentPlayer) {
      setIllegal("it is not your turn");
      return;
    }
    socket.emit('drawCard');
  }


  function login() {
    socket.emit('login', {
      username: username,
      socketID: socket.id
    });
    document.getElementById("login").className = "hide";
    document.getElementById("game").className = "show";
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
    const handCardsContainer = document.getElementById('handCards');
    const remainingHandCards = handCardsContainer.getElementsByClassName('card');
    console.log(remainingHandCards);
    console.log(remainingHandCards.length);
    if (remainingHandCards.length === 0) {
      endGame();
    }

  }
  function endGame() {

    console.log(username);
    socket.emit('endGame', {
      username: username,
      socketID: socket.id
    });

  }

  if (!isAuthenticated) {
    <Router>
      return <Navigate to="/" />;
    </Router>
  }


  return (
    <div>
      <div className='App'>
      </div>
      <div id="login">
        <div className='login-container'>
          <img className='logo' src="/UNO_Logo.png" width="80" alt="UNO Logo" />
          <h2>Login</h2>
          <label>
            Gib deinen Username ein:
          </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

          <button className='login-button' data-testid="login" onClick={login}>start game</button>
        </div>
      </div>
      <div id="game" className='hide'>
        <div className='game-container'>
          <h2>Users</h2>
          <p>Current Player: {currentPlayer}</p> { }
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
          <div id="discardPile" data-testid="discardPile"></div>
          <div onClick={drawCard} id="drawPile" data-testid="drawCard">
            <img src="/UNO_Logo.png" width="80" alt="UNO Logo" />

          </div>
          <div id="handCards" data-testid="handCards"></div>
          <h4>{illegal}</h4>


          <button className='login-button' id='handcard-button' onClick={dealCards} data-testid="deal">give me my cards</button>
        </div>
      </div>
      <h2> {message}</h2>
      <LogoutButton />
    </div>
  );
}

export default UnoGame;
