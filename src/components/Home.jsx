import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';
import { useDarkTheme } from './ThemeContext';


const Home = ({ userID, url, setUrl, nickname, setNickname, setUrlID, setQueriesList, urlList }) => {
  
  const routerHistory = useHistory();
  
  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

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
    // redirect to Dashboard after 1sec delay
    setTimeout(()=>routerHistory.push('/dashboard'), 1000)

    // Send url to main process
    window.api.send("urlToMain", {
      url,
      userID,
      nickname
    });
  
    window.api.receive("queriesFromMain", (allQueries) => {
      setQueriesList(allQueries);
    });

    // Receive urlID from main process
    window.api.receive("idFromMain", (id) => {
      document.querySelector('#connected-text').style.display = 'block';
      document.querySelector('#connected-loading').style.display = 'block';
      console.log('received from main process')
      setUrlID(id);
    })
  }

  // fill in input boxes automatically
  function polyfillUrl(e) {
    document.querySelector('#home-uri-value').innerHTML = e.target.value;
    document.querySelector('#home-uri-name').innerHTML = e.target.name;
    setUrl(e.target.value);
    setNickname(e.target.value);
  }

  return (
    <div id='home' style={themeStyle}>

      <header>
        <h1 id='welcome'>Welcome back!</h1>
      </header>   

      <div id='new-inputs'>
        <h3 className='prompt'>Enter a URL to get started...</h3>
        <input
          onChange={(e) => setUrl(e.target.value)}
          placeholder="GraphQL API"
          id='home-uri-value'
          required
          /> 
        <h3 className='prompt'>Give it a nickname!</h3>
        <input
          onChange={(e) => setNickname(e.target.value)}
          placeholder="URL nickname"
          id='home-uri-name'
          required
          /> 
      </div>

      <div id='previous-inputs'>
        <h3>
          <label htmlFor='uris' className='prompt'>Or select a previously searched URL:</label>
        </h3>
        <select 
          name='uris' 
          id='uris' 
          onChange={
            polyfillUrl
          }
          >
          <option 
            disabled 
            selected
            hidden>(select one)</option>
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
          <h3 id='connected-loading'>Loading Dashboard...</h3>
        </div>
      </div>

    </div>
  )
}

export default Home;