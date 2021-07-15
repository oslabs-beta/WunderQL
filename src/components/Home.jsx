import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from './ThemeContext';

import { channels } from '../shared/constants';
const { ipcRenderer } = window.require("electron");

const Home = ({ uri, setURI, history, setHistory, setUriID, queriesList, uriList }) => {
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  const routerDashboard = useHistory();
  const openUriDashboard = () => {
    routerDashboard.push(
      '/dashboard', 
      {
        uri: uri
      }
    )
  }

  // configure uri list to appear as drop down list upon successful login
  const URIs = [];
  uriList.map((uri, index) => URIs.push(<option value={uri} id={index}>{uri}</option>))
    
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

      <header>
        <h1 id='welcome'>Welcome back, developer!</h1>
      </header>   

      <div id='new-inputs'>
        <h3 class='prompt'>Enter a URI to get started...</h3>
        <input
          onChange={(e) => setURI(e.target.value)}
          placeholder="GraphQL API"
          id='home-uri'
          /> 
      </div>

      <div id='previous-inputs'>
        <h3>
          <label for='uris' class='prompt'>Or select a previously searched URI:</label>
        </h3>
        <select 
          name='uris' 
          id='uris' 
          placeholder='merp' 
          onChange={(e) => setURI(e.target.value)}
          // value='sheeeeesh pick one already'
          >
          <option value="" disabled selected hidden>sheeeesh pick one already</option>
          {URIs}      
        </select>
      </div>

      <div id='submit-connect'>
        <Button 
          variant="contained" 
          id='home-send' 
          color="primary"
          onClick={submitURI}
          >Connect to URI</Button>
        <div id='connected-div'>
          <h3 id='connected-text'>Connected!</h3>
        </div>
      </div>

    </div>
  )
}

export default Home;