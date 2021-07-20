import React, { useState } from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import logo from '../../public/assets/logo-small.png'


const Signup = ({user, setUser, setUrlList }) => {
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const routerHistory = useHistory();

  console.log("from Signup", user)
  const handleSignup = (e) => {
    e.preventDefault();
    console.log("From signup user:", username,"password:", password, "email: ", "fullname: ", fullName)

    //send user info to backend
    window.api.send("signUpToMain", {username, password, email, fullName});

    //if successfully created new user, log in 
    window.api.receive("fromMainSignup", (validUser) => {
      console.log("from fromMainSignup if users exist", validUser)
      setUser({ loggedIn: validUser})
    })
  };

  return (
    <div id="signup-form">
      <div id='signup'>
        <img src={logo} alt='logo'></img>
      </div>
      <form>
        <div className='signup-div'>
          <label htmlFor="name">Full Name: </label>
          <input 
            name="name" 
            placeholder='Full Name' 
            id="name" 
            type="name" 
            required 
            onChange={(e) => setfullName(e.target.value)} 
            />
        </div>
        <div className='signup-div'>
          <label htmlFor="email">Email: </label>
          <input 
            name="email" 
            placeholder='email' 
            id="email" 
            type="email" 
            required 
            onChange={(e) => setEmail(e.target.value)} 
            />
        </div>
        <div className='signup-div'>
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
        <div className='signup-div'>
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
        <div id='signup-button-div'>
          <Button 
            onClick={()=>routerHistory.push('/')}
            variant="contained" 
            id='cancel-button' 
            color="gray"
            >Cancel</Button>
          <Button 
            onClick={handleSignup}
            variant="contained" 
            id='signup-button' 
            color="primary"
            >Signup</Button>
        </div>
      </form>
    </div>
  )
};

export default Signup;