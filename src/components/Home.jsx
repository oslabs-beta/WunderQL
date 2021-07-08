import { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles'

import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");

const Home = ({ uri, setURI, history, setHistory, setUriID }) => {
  // const [data, setData] = useState(null);
  
  // Send URI to electron.js; receive array of objects containing dates + runtime
  const submitURI = () => {
    console.log(uri, ' : URI is being sent to main process...');
    ipcRenderer.send(channels.GET_ENDPOINT, uri);
    ipcRenderer.on(channels.GET_ENDPOINT, (event, arg) => {
      document.querySelector('#connected-text').style.display = 'block';
      setUriID(arg);
    });
    ipcRenderer.on(channels.GET_HISTORY, (event, arg) => {
      // history state updated and stored in App.js
      setHistory(arg);
    })
  }

  return (
    <div id='home'>
      <h1>Welcome back, developer!</h1>
      <h3>Enter a URI to get started...</h3>
      <div id='home-inputs'>
        <input
          onChange={(e) => setURI(e.target.value)}
          placeholder="GraphQL API"
          id='home-uri'
          />
        <button onClick={submitURI} id='home-send'>Get data</button>
      </div>
      <div id='connected-div'>
        <h3 id='connected-text'>Connected!</h3>
      </div>
      {/* {data && (
        <>
          <h3>{data}</h3>
        </>
      )} */}
    </div>
  )
}

export default Home;