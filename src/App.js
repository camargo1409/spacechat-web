import React, { useState, useRef, useEffect } from 'react';
import './assets/App.css'
import socketio from 'socket.io-client'
import crypto from 'crypto'


const socket = socketio('https://spacechat-backend.herokuapp.com/')
function App() {
  const [connectedUsers,setConnectedUsers] = useState([])
  const [message,setMessage] = useState('')
  const [chatMessages,setChatMessages] = useState([])
  const chatbody = useRef()
  useEffect(()=>{
    const div = chatbody.current
    div.scrollTop = div.scrollHeight;
  
  },[chatMessages])
    socket.on('new_connection', function(data){     
      setConnectedUsers(data)  
      console.log();
      
    })

    socket.on('history',function(data){
      setChatMessages(data)
    })

    socket.on('chat message',function(data){
      setChatMessages(data)
    })

    socket.on('user left',function(data){
      setConnectedUsers(data)
    })
  
    
  function handleSubmit(event){
    event.preventDefault()
    socket.emit('message',message)
    setMessage('')
  }
  return (
    <div className="App">
      <div className="sidebar">
        <ul>
          {connectedUsers.map(item=>(
            <li key={item}>{item}</li>
          ))}
        </ul>
      
       
      </div>
      <div className="navbar">
        <h2>SPACECHAT</h2>
      </div>
      <div className="chatbody" ref={chatbody}>
        <ul>
          {chatMessages.map(msg=>(
            <li key={crypto.randomBytes(16).toString('HEX')}
              className={msg.author === socket.id ? 'myMsg' : ''}
            >
              <span>{new Date().toDateString()}</span>
              <strong>{msg.author}</strong>
              <br/>
              {msg.content}
              
            </li>
          ))}
          
        </ul>
      </div>
      <div className="textfield">
        <form onSubmit={handleSubmit}>
          
          <input type="text" placeholder="Digite sua mensagem"
          value={message}
          onChange={e => setMessage(e.target.value)}
          
          />
          <button type="submit">Enviar</button>
        </form>
        
      </div>
    </div>
  );
}

export default App;
