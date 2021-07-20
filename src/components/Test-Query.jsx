import { useState } from "react";
import LineChartComponent from "./DashboardLineChart";
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";

const TestQuery = ({ url, urlID, history, runtime, avgResponseTime, getResponseTimes, queriesList }) => {

  const [query, setQuery] = useState(null);
  const [queryName, setQueryName] = useState('');

  // Invoked when user selects an option from the drop-down
  function handleChange(event) {
    // Add the query string to the text box && update state
    document.querySelector('#text-area').innerHTML = event.target.value
    setQuery(event.target.value)

    // Add the query name to the input box && update state
    const selectedName = event.target.selectedOptions[0].id;
    setQueryName(selectedName);
  }

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }  

  // configure uri list to appear as drop down list upon successful login
  // when connected to backend, replace 'queriesList' with history
  const queries = [];
  if(queriesList) {
    queriesList.map((prevQuery, index) => queries.push(
      <option 
        id={prevQuery.query_name}
        value={prevQuery.query_string} 
        name={prevQuery.query_name}
        >
          {prevQuery.query_name}
        </option>
    ))
  }

  const sendQuery = () => {
    // Sends the message to Electron main process
    if (!query && !queryName) {
      alert('must enter both query and a name!')
      return;
    }
    console.log('Query is being sent to main process...')
    console.log('queryString:', query)
    console.log('queryName:', queryName)

    // setQuery(document.querySelector('#text-area').value);
    // Send uriID, uri, and query to main process
    window.api.send('queryTestToMain', {
      urlID: urlID,
      query: query,
      url: url,
      name: queryName,   
    })

    // Receive updated response times from main process (function defined in App.js)
    getResponseTimes();

  };

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {url}</h2>
        <select
          name='queries-list' 
          id='queries-list' 
          onChange={handleChange}
          >
          <option value="" selected >previously searched queries</option>
          {queries}
          </select>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='Please enter a query...'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          style={themeStyle}
          required
          >{query}</textarea>
        <input
          value={queryName}
          id='uri-name' 
          placeholder='give your query a name' 
          onChange={(e)=>setQueryName(e.target.value)} 
          required   
          />
        <Button 
          variant="contained" 
          id='send-query' 
          color="primary"
          onClick={sendQuery}
          >Send Query</Button>
      </div>
      <div id='stats'>
        <div class='category'>
          <div class='category-title'>Query Response Time</div>
          <div class='category-number'>{`${runtime}ms`}</div>
        </div>
        <div class='category'>
          <div class='category-title'>Average Response Time</div>
          <div class='category-number'>{`${avgResponseTime}ms`}</div>
        </div>
      </div>
      <div id='response-chart'> 
        <LineChartComponent history={history}/>
      </div>
    </div>
  ) 
};

export default TestQuery;