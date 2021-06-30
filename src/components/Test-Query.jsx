// will have to wrap this component in Apollo client provider thing
// import React from 'react';

const TestQuery = () => {
  
  
  const handleURI = (event) => {

  }

  const handleQuery = (event) => {

  }

  return (
    <div id='test-query'> 
      <h1>hello from test query</h1>
      <header>
        <input placeholder='input for URI'></input>
        <button>press me bby</button>
      </header>
      <div id='query-space'>
        <textarea 
          placeholder='input for user query'
          rows='10'
          cols='50'
        ></textarea>
        <button>send query</button>
      </div>
      <div id='response-time'>here's where we're showing the query's runtime</div>
      <div id='num-requests'>here's where we're showing how many requests</div>
    </div>
  ) 
};

export default TestQuery;