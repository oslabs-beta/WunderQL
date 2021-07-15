import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';

import { useState, useEffect } from 'react';
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import TestQuery from './components/Test-Query'
import BatchTest from "./components/LoadTest";
// import Header from './components/Header'
import PreviousSearches from './components/PreviousSearches';
import './stylesheets/index.css';
import { channels } from './shared/constants';

import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';
import { ThemeProvider, useDarkTheme } from "./components/ThemeContext"; 

// export const ThemeContext = createContext();

// const { ipcRenderer } = window.require("electron");


function App() {
  // const [dark, setDark] = useState(false); // or true?
  const [uri, setURI] = useState('(please enter a URI to begin)');
  const [history, setHistory] = useState(null);
  const [uriID, setUriID] = useState(0);
  const [runtime, setRuntime] = useState(0);

  // const toggleDarkMode = () => {console.log('changed theme'); setDark(prevDarkTheme => !prevDarkTheme)}


  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
  });

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  const getResponseTimes = () => {
    // ipcRenderer.on(channels.GET_RESPONSE_TIME, (event, arg) => {
    window.api.receiveArray("ResponseTimesFromMain", (event, arg) => {
      console.log('Listening for response from main process...')
      console.log('arg object received from electronjs: ', arg);

      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      console.log('runtime: ', currRuntime);
      setRuntime(currRuntime);

      //arg is received from DB as an array of objects
      const pastRuntimes = [];
      let x_sum = 0
      let y_sum = 0
      let numerator = 0;
      let denominator = 0;
        arg.forEach((query, index) => {
        x_sum += index;
        y_sum += query.response_time;
      })        
      const x_avg = x_sum / arg.length;
      const y_avg = y_sum / arg.length;
        arg.forEach((query, index) => {
        numerator += ((index - x_avg) * (query.response_time - y_avg));
        denominator += (index - x_avg) ** 2;
      });  
      const slope = numerator / denominator;
      const y_intercept = y_avg - slope * x_avg;
      const lineOfBestFit = (x) => slope * x + y_intercept;
        arg.forEach((query, index) => {
      const date = new Date(query.date).toDateString();
          pastRuntimes.push({
          index: index,
          date: date,
          runtime: query.response_time.toFixed(1),
          best_fit: lineOfBestFit(index).toFixed(1)
        });
      });

      setHistory(pastRuntimes);
      console.log('all past runtimes: ', pastRuntimes);
    });
  }

  // const theme = createMuiTheme({
  //   palette: {
  //       type: dark ? 'dark' : 'light',
  //   },
  // })
    
  return (
    <ApolloProvider client={client}>
      {/* <ThemeContext.Provider value={dark}> */}
      <ThemeProvider>
      {/* <ThemeProvider theme={theme}> */}
        <CssBaseline />
        <div id="App" style={themeStyle}>
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
            <NavBar />
            <Switch>
              <Route exact path="/">
                <Home 
                  // theme={theme} 
                  uri={uri}
                  setURI={setURI} 
                  uriID={uriID} 
                  setUriID={setUriID}
                  history={history} 
                  setHistory={setHistory}
                  />
              </Route>
              <Route path="/dashboard">
                <Dashboard uri={uri} uriID={uriID} history={history}/>
              </Route>
              <Route path="/testquery">
                <TestQuery 
                  client={client} 
                  uri={uri} 
                  uriID={uriID} 
                  history={history}
                  setHistory={setHistory}
                  // runtime={runtime}
                  getResponseTimes={getResponseTimes}
                  />
              </Route>
              <Route path="/loadtest">
                <BatchTest 
                  client={client} 
                  uri={uri} 
                  uriID={uriID} 
                  history={history}
                  setHistory={setHistory}
                  runtime={runtime}
                  getResponseTimes={getResponseTimes}
                  />
              </Route>
              <Route path="/previoussearches">
                <PreviousSearches 
                  uri={uri} 
                  uriID={uriID} 
                  history={history}
                  getResponseTimes={getResponseTimes}
                  />
              </Route>
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
      {/* </ThemeContext.      </ThemeProvider>Provider> */}
    </ApolloProvider>
  );
};

export default App;
