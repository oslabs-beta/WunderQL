// will have to wrap this component in Apollo client provider thing
// import React from 'react';
import { useState, useEffect } from "react";

const TestQuery = () => {
  
  const [uri, setUri] = useState('');
  const [query, setQuery] = useState('');
  const [runtime, setRuntime] = useState(0);
 
  const handleURI = (event) => {
    console.log(event.target.value);
    setUri(event.target.value);
  }

  const submitUri = () => {
    console.log('URI fetch request started');
    fetch('/somewhere', {
      method: 'POST',
      headers: {
        'Accept': 'application/json,text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uri: uri}),
    })
  }

  const handleQuery = (event) => {
    console.log(event.target.value);
    setQuery(event.target.value);
  }

  const submitQuery = () => {
    console.log('QUERY fetch request started');
    fetch('/somewhere', {
      method: 'POST',
      headers: {
        'Accept': 'application/json,text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: query }),
    })
  }

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
          onChange={handleQuery}
          // rows='30'
          // cols='50'
        ></textarea>
        <button id='send-query' onClick={submitQuery}>Submit Query</button>
      </div>
      <div id='response-time'>
        <div id='runtime-title'>Query's Runtime (ms)</div>
        <div id='runtime-number'>150</div>
        {/* <div>{`${runtime} ms`}</div> */}
      </div>
      <div id='num-requests'>
        <div id='num-req-title'>Query's Runtime (req/sec)</div>
        <div id='num-req-number'>523</div>
        {/* <div>{`${runtime} ms`}</div> */}
      </div>
    </div>
  ) 
};

export default TestQuery;