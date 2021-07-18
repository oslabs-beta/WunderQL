import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import { useState, useEffect } from 'react';

import Login from "./components/Login"

// import Header from './components/Header'
import PreviousSearches from './components/PreviousSearches';
import './stylesheets/index.css';
import { channels } from './shared/constants';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
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
  // const toggleDarkMode = () => {console.log('changed theme'); setDark(prevDarkTheme => !prevDarkTheme)}

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
                <MainContainer user={user} setUser={setUser} /> 
                : <Login user={user} setUser={setUser} />}
            </Route>
          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
