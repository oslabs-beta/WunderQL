import { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './Home'
import Dashboard from './Dashboard'
import NavBar from './NavBar'
import TestQuery from './Test-Query'
import LoadTest from "./LoadTest";

// import { ThemeProvider, useDarkTheme } from "./src/components/ThemeContext";
// import { ThemeProvider, useDarkTheme } from "./ThemeContext";

/*
HOME needs: list of URLs
DASHBOARD NEEDS: 
TEST needs: list of queries
LOAD needs: list of load test queries
PREV needs: list of queries
*/

const MainContainer = ({ userID, urlList }) => {
  
  const [url, setUrl] = useState('(please enter a URL to begin)');
  const [nickname, setNickname] = useState(null)
  const [urlID, setUrlID] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [history, setHistory] = useState(null);
  const [queriesList, setQueriesList] = useState([]);

  // calculate single runtime, average runtime, and line-of-best-fit; to be used in test-query
  const getResponseTimes = () => {
    window.api.receiveArray("responseTimesFromMain", (event, arg) => {
      // get the runtime of the most recent query
      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      setRuntime(currRuntime);

      // average of all runtimes
      const responseTimeSum = arg.reduce((sum, curr) => sum += curr.response_time, 0);
      const responseTimeAvg = responseTimeSum / arg.length;
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
  };

  // acquire list of queries; to be sent to test-query, load-test, previous-searches
  window.api.receiveArray('queriesFromMain', data => setQueriesList(data));

  return (
    <div id='main-container'>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/">
              <Home 
                userID={userID}
                url={url}
                setUrl={setUrl} 
                nickname={nickname}
                setNickname={setNickname}
                setUrlID={setUrlID}
                setQueriesList={setQueriesList}
                urlList={urlList}
                />
            </Route>
            <Route path="/dashboard">
              <Dashboard 
                url={url} 
                urlID={urlID} 
                />
            </Route>
            <Route path="/testquery">
              <TestQuery 
                url={url} 
                urlID={urlID} 
                history={history}
                runtime={runtime}
                avgResponseTime={avgResponseTime}
                getResponseTimes={getResponseTimes}
                queriesList={queriesList}
                />
            </Route>
            <Route path="/loadtest">
              <LoadTest 
                url={url} 
                urlID={urlID} 
                queriesList={queriesList}
                />
            </Route>
          </Switch>
        </Router>
    </div>
  )
}

export default MainContainer;