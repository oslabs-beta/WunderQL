import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
// import CssBaseline from '@material-ui/core/CssBaseline';

import { useState } from 'react';
import Login from "./components/Login"
import './stylesheets/index.css';

// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider, useDarkTheme } from "./components/ThemeContext"; 
import MainContainer from "./components/MainContainer";


// Listen for queries from main process
// window.api.receiveArray("queriesFromMain", (event, arg) => {
//   console.log('listening on queriesFromMain in App.js');
  
// })

function App() {
  // const [dark, setDark] = useState(false); // or true?
  const [user, setUser] = useState({
    loggedIn: false
  });
  const [userID, setuserID] = useState(null); // to use in dashboard
  const [urlList, setUrlList] = useState([]); // to use in dashboard



  // const toggleDarkMode = () => {console.log('changed theme'); setDark(prevDarkTheme => !prevDarkTheme)}

  // Set userID when user is logged in 
  window.api.receive("userIDfromMain", (userID) => {
    console.log("In userIDfromMain in App.jsx", userID)
    setuserID(userID)
  })


  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
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
            <Route exact path='/'>
              {user.loggedIn ? 
                <MainContainer user={user} setUser={setUser} urlList={urlList} userID={userID} /> 
                : <Login user={user} setUser={setUser} setUrlList={setUrlList} />}
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;