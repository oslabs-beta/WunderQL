// will have to wrap this component in Apollo client provider thing
// import React from 'react';
import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

const TestQuery = () => {
  

  const [uri, setUri] = useState('');
  const [query, setQuery] = useState('');
  const [runtime, setRuntime] = useState(0);
  // to test fetch to backend
  const [response, setResponse] = useState('');

  const client = new ApolloClient({
    uri: `${uri}`,
    cache: new InMemoryCache(),
  });
  
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

  const handleQuery = (event) => {
    console.log(event.target.value);
    setQuery(event.target.value);
  }

  const submitQuery = () => {
    console.log('QUERY fetch request started');
    // const startTime = performance.now();
    //const startTime = Date.now();
    // fetch(`${uri}`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json,text/plain, */*',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ query: query }),
    // })
    // .then((res) => {
    //   console.log(res)
    //   res.json()
    // })
    fetch('http://localhost:5000/test', {
      method: 'GET',
      headers: {
        'Accept': 'application/json,text/plain, */*',
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ query: query }),
    })
    .then((res) => res.json())
    .then((res) => setResponse(res))
    // client.query({
    //   query: gql`${query}`
    // }).then(result => {
    //   let responseTime = (performance.now() - startTime)
    //   //let responseTime = (Date.now() - startTime)
    //   setRuntime(Number(responseTime.toFixed(1)));
    //   console.log(responseTime)
    //   //console.log(result)
    // })
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
        <div id='runtime-title'>Query Runtime (ms)</div>
        {/* <div id='runtime-number'>150</div> */}
        {/* <div id='runtime-number'>{`${runtime}`}</div> */}
        <div id='runtime-number'>{`${response}`}</div>
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