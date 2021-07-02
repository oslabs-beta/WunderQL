// will have to wrap this component in Apollo client provider thing
// import React from 'react';
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';
import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");
const TestQuery = () => {

  const [uri, setUri] = useState('');
  const [query, setQuery] = useState('');
  const [runtime, setRuntime] = useState(null);
  
  const handleURI = (event) => {
    console.log(event.target.value);
    setUri(event.target.value);
  }

  const submitUri = () => {
    console.log('URI fetch request started');
    fetch('/senduri', {
      method: 'POST',
      headers: {
        'Accept': 'application/json,text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uri: uri}),
    })
  }

  // const handleQuery = (event) => {
  //   console.log(event.target.value);
  //   setQuery(event.target.value);
  // }

  // const submitQuery = () => {
  //   console.log('QUERY fetch request started');
  // }
  
  const getResponse = () => {
    // Sends the message to Electron main process
    console.log('Query is being sent to main process...');
    ipcRenderer.send(channels.GET_RESPONSE, query);
  };

  useEffect(() => {
    // useEffect hook - listens to the get_response channel for the response from electron.js    
    ipcRenderer.on(channels.GET_RESPONSE, (event, arg) => {
      console.log('Listening for response from main process...')
      setRuntime(arg);
      console.log('Query has been returned from main process');
    });
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  return (
    <div id='test-query'> 
      {/* <h1>hello from test query</h1> */}
      <header id='uri'>
        <input 
          id='uri-input' 
          placeholder='input for URI'
          onChange={handleURI}
        ></input>
        <span><button id='send-uri' onClick={submitUri}>Submit URI</button></span>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          id='text-area'
          onChange={(e) => setQuery(e.target.value)}
          // rows='30'
          // cols='50'
        ></textarea>
        <button id='send-query' onClick={getResponse}>Submit Query</button>
      </div>
      <div id='response-time'>
        <div id='runtime-title'>Query Runtime (ms)</div>
        {/* <div id='runtime-number'>150</div> */}
        {/* <div id='runtime-number'>{`${runtime}`}</div> */}
        {runtime && (
          // <div id='runtime-number'>{`${runtime}`}</div>
          <p>{`${runtime}`}</p>
        )}
      </div>
      <div id='num-requests'>
        <div id='num-req-title'>Query Rate (req/sec)</div>
        <div id='num-req-number'>523</div>
        {/* <div>{`${runtime} ms`}</div> */}
      </div>
    </div>
  ) 
};


// client.query({
//   query: gql`
//     query {
//       launchesPast(limit: 10) {
//         mission_name
//         launch_date_local
//         launch_site {
//           site_name_long
//         }
//       }
//     }
//   `
// }).then(result => console.log(result))


export default TestQuery;