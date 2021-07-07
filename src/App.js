import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import { useState, useEffect } from 'react';
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import TestQuery from './components/Test-Query'
// import Header from './components/Header'
import PreviousSearches from './components/PreviousSearches';
import './stylesheets/index.css';
import { channels } from './shared/constants';

import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';
const { ipcRenderer } = window.require("electron");


function App() {
  const [dark, setDark] = useState(false);
  const [uri, setURI] = useState('nothing');
  const [history, setHistory] = useState([]);
  const [uriID, setUriID] = useState(0);

  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
  });

  // const getData = () => {
  //   // Sends the message to Electron main process
  //   console.log('Data is being sent to main process...');
  //   ipcRenderer.send(channels.GET_DATA, product);
  // };

  useEffect(() => {
    // useEffect hook - Listens to the get_data channel for the response from electron.js
    ipcRenderer.on(channels.GET_DATA, (event, arg) => {
      console.log('Listening for response from main process...')
      setHistory(arg);
      console.log('Data has been returned from main process');  
    });
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createMuiTheme({
    palette: {
        type: dark ? 'dark' : 'light',
    },
})
    
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div id="App">
          {/* <Header /> */}
          
          {/* trying to make frameless win draggable */}
          <div className="title-bar">
            <div className="titlebar-drag-region"></div>
            <div className="title">Window Header</div>
            <div className="title-bar-btns">
              <button id="min-btn">-</button>
              <button id="max-btn">+</button>
              <button id="close-btn">x</button>
            </div>
          </div>

          <Router>
            <NavBar handleSwitch={setDark} dark={dark} />
            <Switch>
              <Route exact path="/">
                <Home 
                  theme={theme} 
                  uri={uri} 
                  setUriID={setUriID}
                  setURI={setURI} 
                  history={history} 
                  setHistory={setHistory}
                />
              </Route>
              <Route path="/dashboard">
                <Dashboard uri={uri} history={history}/>
              </Route>
              <Route path="/testquery">
                <TestQuery client={client} uri={uri} history={history}/>
              </Route>
              <Route path="/previoussearches">
                <PreviousSearches />
              </Route>
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
