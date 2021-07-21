import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import './stylesheets/index.css';
import React, { Component }  from 'react';


import { ThemeProvider, useDarkTheme } from './components/ThemeContext.jsx'; 
import MainContainer from './components/MainContainer.jsx';
function App() {
  const [user, setUser] = useState({
    loggedIn: false
  });
  const [userID, setuserID] = useState(null); // to use in dashboard
  const [urlList, setUrlList] = useState([]); // to use in dashboard

  console.log('hello')
  // Set userID when user is logged in 
  window.api.receive('userIdFromMain', (userID) => {
    console.log('In userIdFromMain in App.jsx', userID);
    setuserID(userID);
  });

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  };
    
  console.log('right before return')
  console.log(Login)
  return (
    <ThemeProvider>
      <div id="App" style={themeStyle}>
        <Router>
          <Route exact path='/signup'>
            {user.loggedIn ? 
              <MainContainer 
                user={user} 
                setUser={setUser} 
                urlList={urlList}
                setUrlList={setUrlList} 
                userID={userID}
              ></MainContainer> 
              : 
              <Signup
                user={user} 
                setUser={setUser}
                userID={userID}
                setuserID={setuserID}
                setUrlList={setUrlList}
              ></Signup>}
          </Route>
          <Route path='/'>
            {user.loggedIn ? 
              <MainContainer 
                user={user} 
                setUser={setUser}
                setUrlList={setUrlList}
                urlList={urlList} 
                userID={userID}
              ></MainContainer>
              : <Login
                user={user} 
                setUser={setUser} 
                setUrlList={setUrlList}
              ></Login>}
          </Route>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;


