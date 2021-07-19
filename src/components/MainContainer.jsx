import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';

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
import PreviousSearches from './PreviousSearches';
//import './src/stylesheets/index.css';
import '../stylesheets/index.css'

// import { ThemeProvider, useDarkTheme } from "./src/components/ThemeContext";
import { ThemeProvider, useDarkTheme } from "./ThemeContext";


// fake data for cards in previous-searches
const fakeData = [
  {
    id: 1,
    'Query Name': 'Rocket ships',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 1) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 2,
    'Query Name': 'Raubern ships',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 2) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 3,
    'Query Name': 'Raubern sucks',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 3) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 4,
    'Query Name': 'Rockets dont suck',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 4) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 5,
    'Query Name': 'Rocket is bbygorl',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 5) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 6,
    'Query Name': 'Rocket me',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 6) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 7,
    'Query Name': 'i ship rockets',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 7) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 8,
    'Query Name': 'me like rockets',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 8) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 9,
    'Query Name': 'Rocket rocket rocket',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 9) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 10,
    'Query Name': 'Rocks in a rocket',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 10) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
  {
    id: 11,
    'Query Name': 'Rocket of rocks',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString(),
    query: `query {
      launchesPast(limit: 11) {
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
      }
    }`
    
  },
];
const fakeURIs = [
  'raubern big dum-dum',
  'he dum-dum of all dum-dum',
  'raubern scrum master? more like dum master',
  'why is raubern',
  'no more raubern',
]

/*
HOME needs: list of URLs
DASHBOARD NEEDS: 
TEST needs: list of queries
LOAD needs: list of load test queries
PREV needs: list of queries
*/

const MainContainer = ({ user, setUser }) => {
  
  const [url, setUrl] = useState('(please enter a URL to begin)');
  const [nickname, setNickname] = useState(null)
  const [urlID, setUrlID] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState(0);
  const [history, setHistory] = useState(null);
  const [queriesList, setQueriesList] = useState(fakeData);
  const [dragList, setDragList] = useState([]);
  // const [urlList, setUrlList] = useState(fakeURIs); // to use in dashboard

  // calculate single runtime, average runtime, and line-of-best-fit; to be used in test-query
  const getResponseTimes = () => {
    window.api.receiveArray("responseTimesFromMain", (event, arg) => {
      console.log('Listening for response from main process...')
      
      // get the runtime of the most recent query
      const currRuntime = arg[arg.length - 1].response_time.toFixed(1);
      console.log('runtime: ', currRuntime);
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
                // urlList={urlList}
                avgResponseTime={avgResponseTime}
                />
            </Route>
            <Route path="/dashboard">
              <Dashboard 
                url={url} 
                urlID={urlID} 
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
                getResponseTimes={getResponseTimes}
                queriesList={queriesList}
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
            <Route path="/previoussearches">
              <PreviousSearches 
                url={url} 
                urlID={urlID} 
                // history={history}
                getResponseTimes={getResponseTimes}
                queriesList={queriesList}
                setQueriesList={setQueriesList}
                dragList={dragList}
                setDragList={setDragList}
                />
            </Route>
          </Switch>
        </Router>
    </div>
  )
}

export default MainContainer;