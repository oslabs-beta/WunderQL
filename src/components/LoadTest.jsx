import { useState } from "react";
import ScatterChartComponent from "./DashboardScatterChart";
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";


const LoadTest = ({ url, urlID, queriesList }) => {

  const [query, setQuery] = useState(null);
  const [loadTestQueryName, setloadTestQueryName] = useState('');
  const [loadAmount, setLoadAmount] = useState(null);
  const [avgResponseTime, setavgResponseTime] = useState(0);
  const [successOrFailure, setsuccessOrFailure] = useState('n/a');
  const [loadTestHistory, setLoadTestHistory] = useState([])

  // Invoked when user selects an option from the drop-down
  function handleChange(event) {
    // Add the query string to the text box && update state
    document.querySelector('#text-area').innerHTML = event.target.value
    setQuery(event.target.value)

    // Add the query name to the input box && update state
    const selectedName = event.target.selectedOptions[0].id;
    setloadTestQueryName(selectedName);
  }

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  //configure list of queries to display in drop-down
  const queries = [];
  queriesList.map((prevQuery, index) => queries.push(
    <option value={prevQuery.query_string} name={prevQuery.query_name}id={prevQuery.query_name}>{prevQuery.query_name}</option>
  ))
  console.log('queriesList', queriesList)

  const sendQuery = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...')

    // Initiate load test when user clicks 'Submit Query'
    window.api.send("loadTestQueryToMain", {
      numOfChildProccesses: loadAmount,
      query: query,
      url: url,
      urlID: urlID,
      loadTestQueryName: loadTestQueryName
    })

    window.api.receiveArray("loadTestResultsFromMain", (event, loadTestResults) => {
      // console.log('Listening for loadTest response from main process...')
      // console.log('loadTestResults', loadTestResults);
      setavgResponseTime(loadTestResults[loadTestResults.length - 1].average_response_time.toFixed(1));
      setsuccessOrFailure(loadTestResults[loadTestResults.length - 1].result);
      
      // array of all load tests ran; data to send to scatter plot
      setLoadTestHistory(loadTestResults);
    });
  }

  return (
    <div id='test-query' style={themeStyle}> 
      <header className='uri'>
        <p>Currently connected to: <span><strong>{url}</strong></span></p>
        <select
          name='queries-list' 
          id='queries-list' 
          onChange={handleChange}
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
          required
          >{query}</textarea>

        <input
          value={loadTestQueryName}
          id='uri-name' 
          placeholder='give your query a name' 
          onChange={(e)=>setloadTestQueryName(e.target.value)} 
          required   
          />

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
        <div className='category'>
          <div className='category-title'>Avg Batch Response Time for {loadAmount} Requests</div>
          <div className='category-number'>{`${avgResponseTime} ms`}</div>
        </div>
        <div className='category'>
          <div className='category-title'>Result</div>
          <div className='category-number'>{`${successOrFailure}`}</div>
        </div>

      </div>
      <div id='response-chart'> 
        <ScatterChartComponent loadTestHistory={loadTestHistory}/>
      </div>
    </div>
  ) 
};



export default LoadTest;