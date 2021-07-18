import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom'
import LineChartComponent from "./DashboardLineChart";
// import { channels } from '../shared/constants';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from "./ThemeContext";
// const { ipcRenderer } = window.require("electron");

const TestQuery = ({ url, urlID, history, setHistory, runtime, avgResponseTime, getResponseTimes, queriesList }) => {

  const [query, setQuery] = useState(null);
  const [queryName, setQueryName] = useState(null);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // configure query list to appear as drop down list
  const queries = [];
  queriesList.map((prevQuery, index) => queries.push(
    <option value={prevQuery.query} name={prevQuery.query_name}id={index}>{prevQuery.query_name}</option>
  ))
    
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
    if (!query && !queryName) {
      alert('must enter both query and a name!')
      return;
    }
    console.log('Query is being sent to main process...')
    
    // Send uriID, uri, and query to main process
    window.api.send('queryTestToMain', {
      urlID: urlID,
      query: query,
      url: url,   
    })
    
    // Listen for response times from main process (function defined in MainContainer.jsx)
    getResponseTimes();
  };

  return (
    <div id='test-query' style={themeStyle}> 
      <header class='uri'>
        <h2>Currently connected to: {url}</h2>
        <select
          name='queries-list' 
          id='queries-list' 
          onChange={(e) => {
            document.querySelector('#text-area').innerHTML = e.target.value;
            document.querySelector('#uri-name').innerHTML = e.target.name;
            }}
          >
          <option 
            disabled 
            selected 
            hidden
            // value='previously searched queries'
            >previously searched queries</option>
          {queries}   
        </select>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          style={themeStyle}
          required
          >{queryProp}</textarea>
        <input 
          id='uri-name' 
          placeholder='give your url a name' 
          onChange={(e)=>setQueryName(e.target.value)}
          required
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