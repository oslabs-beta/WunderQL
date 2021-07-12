import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./LineChart";
import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';

const { ipcRenderer } = window.require("electron");

const BatchTest = ({ uri, uriID, history, runtime, getResponseTimes }) => {

  const [query, setQuery] = useState('');
  

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
    <div id='test-query'> 
      <header class='uri'>
        <h2>Currently connected to: {uri}</h2>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
        ></textarea>
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
        <div class='category'>
          <div class='category-title'>Number of Requests to Failure</div>
          <div class='category-number'>100</div>
        </div>
        <div class='category'>
          <div class='category-title'>Number of Null Responses</div>
          <div class='category-number'>100</div>
        </div>
        <div class='category'>
          <div class='category-title'>Response Time for Batch Test</div>
          <div class='category-number'>100</div>
        </div>
      </div>
      <div id='response-chart'> 
        <LineChartComponent history={history}/>
      </div>
    </div>
  ) 
};



export default BatchTest;