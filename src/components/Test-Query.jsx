// will have to wrap this component in Apollo client provider thing
import { useState, useEffect } from "react";
import LineChartComponent from "./LineChart";
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");

const TestQuery = ({ client, uri }) => {

  const [query, setQuery] = useState('');
  const [runtime, setRuntime] = useState(0);
  
  const sendQuery = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...')
    ipcRenderer.send(channels.GET_RESPONSE, query);
  };

  // commented out because calculating runtime from FE (for now)
  useEffect(() => {
    // useEffect hook - listens to the get_response channel for the response from electron.js    
    ipcRenderer.on(channels.GET_RESPONSE, (event, arg) => {
      console.log('Listening for response from main process...')
      setRuntime(arg);
      console.log(arg, ' : Query has been returned from main process');
    });
    
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  return (
    <div id='test-query'> 
      <header id='uri'>
        <h2>Currently connected to: {uri}</h2>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}

        ></textarea>
        <button id='send-query' onClick={sendQuery}>Submit Query</button>
      </div>
      <div id='response-time'>
        <div id='runtime-title'>Query Runtime (ms)</div>
        <div id='runtime-number'>{`${runtime}`}</div>
        {/* {runtime && (
          <p>{`${runtime}`}</p>
        )} */}
      </div>
      <div id='response-chart'> 
        <LineChartComponent />
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