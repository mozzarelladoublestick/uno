import socketIO from 'socket.io-client';
import React, { useEffect, useState } from 'react';
const socket = socketIO.connect('http://localhost:4000');


function App() {
  const [message, setMessage] = useState('yello');
  const [users, setUsers] = useState([]);

  
useEffect(() => {
  socket.on('login', (data) =>   setUsers((prevUsers) => [...prevUsers, data.text]));
}, [socket]);


  function startGame() {
    console.log("sent message");
    socket.emit('start', {
        text: message, // Use 'text' instead of 'message'
        socketID: socket.id,
    });
}
const [username, setUsername] = useState('');
function login(){
  socket.emit('login',{
    username: username,
    socketID:socket.id
  })
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
    </div>
  );
}
export default App;
