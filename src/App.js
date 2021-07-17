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
import Login from "./components/Login"
import PreviousSearches from './components/PreviousSearches';
import './stylesheets/index.css';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { ThemeProvider, useDarkTheme } from "./components/ThemeContext"; 


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

function App() {
  // const [dark, setDark] = useState(false); // or true?
  const [uri, setURI] = useState('(please enter a URI to begin)');
  const [nickname, setNickname] = useState(null)
  const [history, setHistory] = useState(null);
  const [uriID, setUriID] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [queriesList, setQueriesList] = useState(fakeData);
  const [uriList, setUriList] = useState(fakeURIs); // to use in dashboard

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

  // get response time for one query call; function updates state here then sent to test-query
  const getResponseTimes = () => {
    // ipcRenderer.on(channels.GET_RESPONSE_TIME, (event, arg) => {
    window.api.receiveArray("ResponseTimesFromMain", (event, arg) => {
      console.log('Listening for response from main process...')
      // arg is received from DB as an array of objects
      // console.log('arg object received from electronjs: ', arg);
      
      // 
      
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
              <Route exact path="/home">
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
                  uriList={uriList}
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
              <Route path="/login">
                <Login />
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
