import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from './ThemeContext';

import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");

const Home = ({ uri, setURI, history, setHistory, setUriID }) => {
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }
  
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
  // Material UI Button
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

  const classes = useStyles();

  return (
    <div id='home' style={themeStyle}>      
      <h1 id='welcome'>Welcome back, developer!</h1>
      <h3 id='enter'>Enter a URI to get started...</h3>
      <div id='home-inputs'>
        <input
          onChange={(e) => setURI(e.target.value)}
          placeholder="GraphQL API"
          id='home-uri'
          />
        {/* <button onClick={submitURI} id='home-send'>Get data</button> */}
        <Button 
          variant="contained" 
          id='home-send' 
          color="primary"
          onClick={submitURI}
        >Connect to URI</Button>
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