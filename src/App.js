import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useState } from 'react';
import Login from "./components/Login"
import Signup from "./components/Signup"
import './stylesheets/index.css';

import { ThemeProvider, useDarkTheme } from "./components/ThemeContext"; 
import MainContainer from "./components/MainContainer";

function App() {
  const [user, setUser] = useState({
    loggedIn: false
  });
  const [userID, setuserID] = useState(null); // to use in dashboard
  const [urlList, setUrlList] = useState([]); // to use in dashboard

  // Set userID when user is logged in 
  window.api.receive("userIdFromMain", (userID) => {
    console.log("In userIdFromMain in App.jsx", userID)
    setuserID(userID)
  })

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }
    
  return (
    <ThemeProvider>
      <div id="App" style={themeStyle}>
        <Router>
          <Switch>
            <Route path='/signup'>
              {user.loggedIn ? <MainContainer 
                                  user={user} 
                                  setUser={setUser} 
                                  urlList={urlList} 
                                  userID={userID} /> 
                              : <Signup 
                                  user={user} 
                                  setUser={setUser}
                                  userID={userID}
                                  setuserID={setuserID}
                                  setUrlList={setUrlList}
                                  />}
                                  </Route>
            <Route exact path='/'>
              {user.loggedIn ? <MainContainer 
                                  user={user} 
                                  setUser={setUser} 
                                  urlList={urlList} 
                                  userID={userID} /> 
                              : <Login 
                                  user={user} 
                                  setUser={setUser} 
                                  setUrlList={setUrlList}
                                  />}
                                  </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;