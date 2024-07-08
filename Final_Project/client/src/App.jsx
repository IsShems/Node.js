import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/styles.css';
import person1 from './assets/messagesearch.png';
import person2 from './assets/depositphotos_268623924-stock-photo-portrait-close-up-of-young.jpg';
import person3 from './assets/istockphoto-1222823238-612x612.jpg';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Chat from './Chat';

const App = () => {

  let [token, setToken] = useState('')
  useEffect(() => {
    let token = sessionStorage.getItem('token')
    console.log(token);
    if (token) {
      setToken(token)
    }
  }, [])

  const array = [
    { name: "Sasha", image: person1 },
    { name: "Nina", image: person2 },
    { name: "Bob", image: person3 }
  ];

  return (
    <Router>
      <div className='app'>
        <Routes>
          {token ? (
            <Route path="/chat/:chatId" element={<Chat array={array} />} />
          )
            : <></>
          }
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/signIn" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
