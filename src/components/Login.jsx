import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import logo from '../../public/assets/logo-small.png'


const Login = ({user, setUser, setUrlList }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // display error if wrong credentials used
    if (!user.loggedIn) document.querySelector('#invalid-text').style.display = 'block';

    console.log("From login user:", username,"password:", password)

    window.api.send("loginToMain", {username, password});
    window.api.receive("userLoggedInFromMain", (validUser) => {
      setUser({ loggedIn: validUser})
    })

    // request URLs from the db as soon as user logs in...might need to add conditionals here
    window.api.receive('urlsFromMain', data => setUrlList(data));
    
  };

  
  return (
    <div id="login-form">
      <div id='logo'>
        <img src={logo} alt='logo'></img>
      </div>
      <form>
        <div className='login-div'>
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
        <div className='login-div'>
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
            onClick={handleLogin}
            variant="contained" 
            id='login-button' 
            color="primary"
          >Login</Button>
          <div id='signup-link-div'>Not a User?&nbsp;    
            <Link to='/signup'>Sign Up</Link>
          </div>
        </div>
      </form>
      <div id='invalid-credentials'>
        <h3 id='invalid-text'>Invalid username and/or password!</h3>
      </div>
    </div>
  )
};

export default Login;