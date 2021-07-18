import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import Home from './Home'
import Dashboard from './Dashboard'
import NavBar from './NavBar'
import TestQuery from './Test-Query'
import BatchTest from "./LoadTest";
// import Header from './components/Header'
import PreviousSearches from './PreviousSearches';
//import './src/stylesheets/index.css';
import '../stylesheets/index.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import { ThemeProvider, useDarkTheme } from "./src/components/ThemeContext";
import { ThemeProvider, useDarkTheme } from "./ThemeContext";

const MainContainer = ({
  uri, setURI,
  uriID, setUriID,
  nickname, setNickname,
  history, setHistory,
  queriesList, setQueriesList,
  uriList, setUriList,
  runtime, setRuntime,
  userID
}) => {
  // setURI('https://api.spacex.land/graphql/')
  // console.log(uri)
  const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache()
  });

  const getResponseTimes = () => {
    window.api.receiveArray("responseTimesFromMain", (event, arg) => {
      console.log('Listening for response from main process...')
      
      // get the runtime of the most recent query
      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      console.log('runtime: ', currRuntime);
      setRuntime(currRuntime);

      // statistical analysis to plot line-of-best-fit
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
    });

  }

  return (
    <div id='MainContainer'>
      <ApolloProvider client={client}>
      {/* <ThemeContext.Provider value={dark}> */}
      <ThemeProvider>
      {/* <ThemeProvider theme={theme}> */}
        <CssBaseline />
          {/* <Header /> */}
          
          {/* trying to make frameless win draggable */}
          {/* <div className="title-bar">
            <div className="titlebar-drag-region"></div>
            <div className="title">Window Header</div>
            <div className="title-bar-btns">
              <button id="min-btn">-</button>
              <button id="max-btn">+</button>
              <button id="close-btn">x</button>
            </div>
          </div> */}
           <h1>Welcome back to the Main Container</h1>
          <Router>
            <NavBar />
            <Switch>
              <Route path="/home">
                <Home 
                  // theme={theme} 
                  uri={uri}
                  setURI={setURI} 
                  nickname={nickname}
                  setNickname={setNickname}
                  uriID={uriID} 
                  setUriID={setUriID}
                  history={history} 
                  setHistory={setHistory}
                  queriesList={queriesList}
                  setQueriesList={setQueriesList}
                  uriList={uriList}
                  setUriList={setUriList}
                  userID={userID}
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
                  runtime={runtime}
                  getResponseTimes={getResponseTimes}
                  setQueriesList={setQueriesList}
                  queriesList={queriesList}
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
                  setRuntime={setRuntime}
                  getResponseTimes={getResponseTimes}
                  />
              </Route>
              <Route path="/previoussearches">
                <PreviousSearches 
                  uri={uri} 
                  uriID={uriID} 
                  history={history}
                  getResponseTimes={getResponseTimes}
                  queriesList={queriesList}
                  setQueriesList={setQueriesList}
                  />
              </Route>
            </Switch>
          </Router>
          </ThemeProvider>
        </ApolloProvider>
    </div>

  )
}

export default MainContainer;