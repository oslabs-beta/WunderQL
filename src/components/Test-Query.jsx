import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./LineChart";
import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";
const { ipcRenderer } = window.require("electron");

const TestQuery = ({ client, uri, uriID, history, setHistory, runtime, getResponseTimes }) => {

  const [query, setQuery] = useState('');
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // this is for when a card was clicked in the 'previous searches' component and the query
  // is passed as a prop when user is rerouted back to this component
  let queryProp = null;
  let location = useLocation();
  if (location.state) {
    console.log(location.state)
    queryProp = location.state.queryProp;
    console.log('queryProp sent from cards: ', queryProp)
    // document.querySelector('#text-area').value = location.state.queryProp;
  }

  const sendQuery = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...')

    ipcRenderer.send(channels.GET_RESPONSE_TIME, {
      uriID: uriID,
      query: query,
    });
  };

  // commented out because calculating runtime from FE (for now)
  useEffect(() => {
    getResponseTimes();
    
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  });

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {uri}</h2>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          style={themeStyle}
        >{queryProp}</textarea>
        <Button 
          variant="contained" 
          id='send-query' 
          color="primary"
          onClick={sendQuery}
        >Send Query</Button>
      </div>
      <div id='stats'>
        <div class='category'>
          <div class='category-title'>Query Response Time (ms)</div>
          <div class='category-number'>{`${runtime}`}</div>
          {/* <div class='category-number'>100</div> */}
          {/* {runtime && (
            <p>{`${runtime}`}</p>
          )} */}
        </div>
        <div class='category' id='failure'>
          <div class='category-title'>Number of Requests to Failure</div>
          <div class='category-number'>100</div>
        </div>
        <div class='category'>
          <div class='category-title'>Number of Null Responses</div>
          <div class='category-number'>100</div>
        </div>
        {/* <div class='category'>
          <div class='category-title'>Response Time for Batch Test</div>
          <div class='category-number'>100</div>
        </div> */}
      </div>
      <div id='response-chart'> 
        <LineChartComponent history={history}/>
      </div>
    </div>
  ) 
};


    // const startTime = performance.now();

    // fetch(uri, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json,text/plain, */*',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ query: query })
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //     let responseTime = (performance.now() - startTime)
    //     setRuntime(Number(responseTime.toFixed(1)));
    //   })

    /**this seems to be measuring runtime of promise 
    client.query({
      query: gql`${query}`
    }).then(result => {
      let responseTime = (performance.now() - startTime)
      // let responseTime = (Date.now() - startTime)
      setRuntime(Number(responseTime.toFixed(1)));
    })
    */

// client.query({
  // query: gql`
    // query {
    //   launchesPast(limit: 10) {
    //     mission_name
    //     launch_date_local
    //     launch_site {
    //       site_name_long
    //     }
    //   }
    // }
//   `
// }).then(result => console.log(result))


export default TestQuery;