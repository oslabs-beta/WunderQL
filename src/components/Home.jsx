import { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles'

import { channels } from '../shared/constants';
//const { ipcRenderer } = window.require("electron");

const Home = ({ uri, setURI }) => {
  // const [data, setData] = useState(null);
  

  const submitURI = () => {
    console.log(uri, ' : URI is being sent to main process...');
    // ipcRenderer.send(channels.GET_URI, uri);
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
      {/* {data && (
        <>
          <h3>{data}</h3>
        </>
      )} */}
    </div>
  )
}

export default Home;