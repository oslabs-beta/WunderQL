import React, { useState, useEffect } from 'react';

import axios from "axios";

import { Link } from 'react-router-dom';
import { channels } from '../shared/constants';

import Button from '@material-ui/core/Button';
import logo from '../../public/assets/logo-small.png'




const Login = ({user, setUser}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [user, setUser] = useState({loggedIn: false});
  //let authorize = false;

  console.log("from Login", user)
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("From login user:", username,"password:", password)

    window.api.send("loginToMain", {username, password});
    window.api.receive("fromMain", (validUser) => {
      console.log("from main validUser", validUser)
      setUser({ loggedIn: validUser})
      console.log("from handleLogin authorize 1", user)
    })

      
  };
  console.log("from Login outside Handlogin", user)
  

  //<form onSubmit={handleLogin} >
  //={() => setCount(count + 1)}>
  return (
    <div id="login-form">
      <div id='logo'>
        <img src={logo} alt='logo'></img>
      </div>
      <form onClick={handleLogin} >
          <div>
            <label htmlFor="username">Username: </label>
            <input 
              name="username" 
              placeholder='Username' 
              id="username" 
              type="username" 
              required 
              onChange={(e) => setUsername(e.target.value)} 
              />
          </div>
          <div>
            <label htmlFor="password">Password: </label>
            <input 
              name="password" 
              placeholder='Password' 
              id="password" 
              type="password" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
              />
          </div>
          <div id='login-button-div'>
            <Button 
              variant="contained" 
              id='login-button' 
              color="primary"
              >Login</Button>
          </div>
      </form>
    </div>
  )
};

export default Login;