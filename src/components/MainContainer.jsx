/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './Home.jsx';
import Dashboard from './Dashboard.jsx';
import NavBar from './NavBar.jsx';
import TestQuery from './Test-Query.jsx';
import LoadTest from './LoadTest.jsx';

// import { ThemeProvider, useDarkTheme } from "./src/components/ThemeContext";
// import { ThemeProvider, useDarkTheme } from "./ThemeContext";

/*
HOME needs: list of URLs
DASHBOARD NEEDS: 
TEST needs: list of queries
LOAD needs: list of load test queries
PREV needs: list of queries
*/

const MainContainer = ({ userID, urlList, setUrlList}) => {
  
  const [url, setUrl] = useState('(please enter a URL to begin)');
  const [nickname, setNickname] = useState(null);
  const [urlID, setUrlID] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [totalRuntimes, setTotalRuntimes] = useState(0);
  const [totalLoadTests, setTotalLoadTests] = useState(0);
  const [totalUniqueQueries, setTotalUniqueQueries] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [history, setHistory] = useState(null);
  const [queriesList, setQueriesList] = useState([]);

  // calculate single runtime, average runtime, and line-of-best-fit; to be used in test-query
  const getResponseTimes = () => {
    window.api.receiveArray('responseTimesFromMain', (event, arg) => {
      console.log('Listening for response from main process...');

      // get the runtime of the most recent query
      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      console.log('runtime: ', currRuntime);
      setRuntime(currRuntime);

      // average of all runtimes
      const responseTimeSum = arg.reduce((sum, curr) => sum += curr.response_time, 0);
      console.log('sum of all response times: ', responseTimeSum);
      const responseTimeAvg = responseTimeSum / arg.length;
      console.log('avg of all response times: ', responseTimeAvg);
      setAvgResponseTime(responseTimeAvg.toFixed(1));

      // statistical analysis to plot line-of-best-fit
      const pastRuntimes = [];
      let x_sum = 0;
      let y_sum = 0;
      let numerator = 0;
      let denominator = 0;
      arg.forEach((query, index) => {
        x_sum += index;
        y_sum += query.response_time;
      });        
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
      
      console.log('history of past runtimes (from maincontainer): ', history);
      setHistory(pastRuntimes);
    });
  };

  // acquire list of queries; to be sent to test-query, load-test, previous-searches
  window.api.receiveArray('queriesFromMain', data => setQueriesList(data));

  return (
    <div id='main-container'>
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
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home 
              url={url}
              setUrl={setUrl} 
              nickname={nickname}
              setNickname={setNickname}
              urlID={urlID} 
              setUrlID={setUrlID}
              // history={history} 
              // setHistory={setHistory}
              queriesList={queriesList}
              setQueriesList={setQueriesList}
              urlList={urlList}
              setUrlList={setUrlList}
              userID={userID}
              setTotalRuntimes={setTotalRuntimes}
              setTotalUniqueQueries={setTotalUniqueQueries}
              setTotalLoadTests={setTotalLoadTests}
            />
          </Route>
          <Route path="/dashboard">
            <Dashboard 
              url={url} 
              urlID={urlID} 
              totalRuntimes={totalRuntimes}
              setTotalRuntimes={setTotalRuntimes}
              totalUniqueQueries={totalUniqueQueries}
              setTotalUniqueQueries={setTotalUniqueQueries}
              totalLoadTests={totalLoadTests}
              setTotalLoadTests={setTotalLoadTests}
              // history={history}
            />
          </Route>
          <Route path="/testquery">
            <TestQuery 
              url={url} 
              urlID={urlID} 
              history={history}
              // setHistory={setHistory}
              runtime={runtime}
              avgResponseTime={avgResponseTime}
              getResponseTimes={getResponseTimes}
              queriesList={queriesList}
              // setQueriesList={setQueriesList}
            />
          </Route>
          <Route path="/loadtest">
            <LoadTest 
              url={url} 
              urlID={urlID} 
              // history={history}
              // setHistory={setHistory}
              runtime={runtime}
              setRuntime={setRuntime}
              getResponseTimes={getResponseTimes}
              queriesList={queriesList}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default MainContainer;