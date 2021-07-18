import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from './ThemeContext';


const Home = ({ url, setUrl, nickname, setNickname, history, setHistory, setUrlID, queriesList, urlList }) => {
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // const routerDashboard = useHistory();
  // const openUriDashboard = () => {
  //   routerDashboard.push(
  //     '/dashboard', 
  //     {
  //       uri: uri
  //     }
  //   )
  // }
  
  // run as component mounts to get array of url names - will there be url id?
  const URLs = [];
  // useEffect(() => {
    window.api.receiveArray('UrlsfromMain', data => {
      console.log('trying to get urls from main: ', data)
      // configure uri list to appear as drop down list upon successful login
      data.map((url, index) => URLs.push(<option value={url.url} name={url.nickname}id={index}>{url.nickname}</option>))
    });
  // })
  
  // Send URI to electron.js; receive array of objects containing dates + runtime
  const submitUrl = () => {
    console.log(url, ' : URI is being sent to main process...');
    
    // Send url and nickname to main process
    window.api.send("urlToMain", {url, nickname});
    
    // Receive uriID from main process
    window.api.receive("idFromMain", (id) => {
      console.log('Within window.api.receive in Home.jsx, id: ', id);
      document.querySelector('#connected-text').style.display = 'block';
      console.log('received from main process')
      setUrlID(id);
    })
  }

  return (
    <div id='home' style={themeStyle}>

      <header>
        <h1 id='welcome'>Welcome back!</h1>
      </header>   

      <div id='new-inputs'>
        <h3 class='prompt'>Enter a URI to get started...</h3>
        <input
          onChange={(e) => setUrl(e.target.value)}
          placeholder="GraphQL API"
          id='home-uri-value'
          required
          /> 
        <h3 class='prompt'>Give that bad boi a name!</h3>
        <input
          onChange={(e) => setNickname(e.target.value)}
          placeholder="URL nickname"
          id='home-uri-name'
          required
          /> 
      </div>

      <div id='previous-inputs'>
        <h3>
          <label htmlFor='uris' class='prompt'>Or select a previously searched URL:</label>
        </h3>
        <select 
          name='uris' 
          id='uris' 
          onChange={(e) => {
            setUrl(e.target.value);
            document.querySelector('#home-uri-value').innerHTML = e.target.value;
            document.querySelector('#home-uri-name').innerHTML = e.target.name;
          }}
          >
          <option 
            // value="sheeeeesh pick one already" 
            disabled 
            selected
            hidden>sheeeesh pick one already</option>
          {URLs}      
        </select>
      </div>

      <div id='submit-connect'>
        <Button 
          variant="contained" 
          id='home-send' 
          color="primary"
          onClick={submitUrl}
          >Connect to URL</Button>
        <div id='connected-div'>
          <h3 id='connected-text'>Connected!</h3>
        </div>
      </div>

    </div>
  )
}

export default Home;