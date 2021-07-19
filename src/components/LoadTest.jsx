import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./DashboardLineChart";
import ScatterChartComponent from "./DashboardScatterChart";
import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";


const LoadTest = ({ uri, uriID, getResponseTimes, queriesList }) => {

  const [query, setQuery] = useState('');
  const [loadAmount, setLoadAmount] = useState(null);
  const [avgResponseTime, setavgResponseTime] = useState(0);
  const [successOrFailure, setsuccessOrFailure] = useState('');

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  //configure list of queries to display in drop-down
  const queries = [];
  queriesList.map((prevQuery, index) => queries.push(
    <option value={prevQuery.query} name={prevQuery.query_name}id={index}>{prevQuery.query_name}</option>
  ))

  const sendQuery = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...')

    // Initiate load test when user clicks 'Submit Query'
    window.api.send("loadTestQueryToMain", {
      numOfChildProccesses: loadAmount,
      query: query,
      uri: uri,
      uriID: uriID,
    })

    window.api.receiveArray("loadTestResultsFromMain", (event, loadTestResults) => {
      console.log('Listening for loadTest response from main process...')
      console.log('loadTestResults', loadTestResults);
      setavgResponseTime(loadTestResults.averageResponseTime.toFixed(2));
      setsuccessOrFailure(loadTestResults.successOrFailure);

    });
  }

  // useEffect(() => {
  //   getResponseTimes();
  // });

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {uri}</h2>
        <select
          name='queries-list' 
          id='queries-list' 
          onChange={(e) => {
            document.querySelector('#text-area').innerHTML = e.target.value;
            document.querySelector('#uri-name').innerHTML = e.target.name;
            }}
          >
          <option disabled selected hidden>previously searched queries</option>
          {queries}   
        </select>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          ></textarea>
        <input 
          type='number' 
          id='load-amount' 
          name='loadAmount' 
          min='0' 
          max='1000'
          onChange={(e) => setLoadAmount(e.target.value)}
          ></input>
        <Button 
          variant="contained" 
          id='send-query' 
          color="primary"
          onClick={sendQuery}
          >Send Query</Button>
      </div>
      <div id='stats'>
        <div class='category'>
          <div class='category-title'>Avg Batch Response Time for {loadAmount} Requests</div>
          <div class='category-number'>{`${avgResponseTime} ms`}</div>
        </div>
        <div class='category'>
          <div class='category-title'>Result</div>
          <div class='category-number'>{`${successOrFailure}`}</div>
        </div>
        <div class='category'>
          <div class='category-title'>Number of Null Responses</div>
          <div class='category-number'>100</div>
        </div>

      </div>
      <div id='response-chart'> 
        {/* <LineChartComponent history={history}/> */}
        <ScatterChartComponent />
      </div>
    </div>
  ) 
};



export default LoadTest;