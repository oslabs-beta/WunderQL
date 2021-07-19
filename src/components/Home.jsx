import { useState, useEffect, useContext } from 'react';
// import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from './ThemeContext';

const fakeURLs = [
  'raubern big dum-dum',
  'he dum-dum of all dum-dum',
  'raubern scrum master? more like dum master',
  'why is raubern',
  'no more raubern',
]

const Home = ({ userID, url, setUrl, nickname, setNickname, history, setHistory, setUrlID, queriesList, setQueriesList, urlList }) => {
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  // const routerDashboard = useHistory();
  // const openUrlDashboard = () => {
  //   routerDashboard.push(
  //     '/dashboard', 
  //     {
  //       url: url
  //     }
  //   )
  // }
  
  // configure url dropdown list in home
  const URLs = [];
  urlList.map((url, index) => URLs.push(
    <option 
      key={index} 
      id={url._id}
      value={url.url} 
      name={url.nickname}
      >
        {url.nickname}
      </option>
  ));

  
  // Send URl to electron.js; receive array of objects containing dates + runtime
  const submitUrl = () => {
    console.log(url, ' : URL is being sent to main process...');
    
    // Send url to main process
    window.api.send("urlToMain", {
      url,
      userID,
      nickname
    });
    
    window.api.receive("queriesFromMain", (allQueries) => {
      //did someone move this?
      // console.log("In queriesfromMain in Test-Query.jsx", allQueries)
      console.log("In queriesfromMain in Home.jsx", allQueries)
      setQueriesList(allQueries)
    })

    // Receive urlID from main process
    window.api.receive("idFromMain", (id) => {
      console.log('Within window.api.receive in Home.jsx, id: ', id);
      document.querySelector('#connected-text').style.display = 'block';
      console.log('received from main process')
      setUrlID(id);
    })
  }

  console.log('end of component: ', URLs)
  return (
    <div id='home' style={themeStyle}>

      <header>
        <h1 id='welcome'>Welcome back!</h1>
      </header>   

      <div id='new-inputs'>
        <h3 class='prompt'>Enter a URL to get started...</h3>
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
            console.log('chosen from list: ', e.target.value)
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