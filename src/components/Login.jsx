import React, { useState } from 'react';
import axios from "axios";

import { Link } from 'react-router-dom';
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");


const Login = ({ user, setUser }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("From login user:", username,"password:", password)
    ipcRenderer.send(channels.GET_USER_AUTH,{username, password});

}

  return (
    <div id="login-form">
      <form onSubmit={handleLogin} >
          <div>
              <label htmlFor="username">Username: </label>
              <input name="username" placeholder='Username' id="username" type="username" required onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
              <label htmlFor="password">Password: </label>
              <input name="password" placeholder='Password' id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
              <button id="login__btn" type="submit">Login </button>
          </div>
      </form>
    </div>
  )
};

export default Login;