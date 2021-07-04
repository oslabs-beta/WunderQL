import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import TestQuery from './components/Test-Query'
// import Header from './components/Header'
import Playground from './components/Playground';
import './stylesheets/index.css';
import { channels } from './shared/constants';
const { ipcRenderer } = window.require("electron");

function App() {
  // const [product, setProduct] = useState('');
  const [data, setData] = useState(null);

  // const getData = () => {
  //   // Sends the message to Electron main process
  //   console.log('Data is being sent to main process...');
  //   ipcRenderer.send(channels.GET_DATA, product);
  // };

  useEffect(() => {
    // useEffect hook - Listens to the get_data channel for the response from electron.js
    ipcRenderer.on(channels.GET_DATA, (event, arg) => {
      console.log('Listening for response from main process...')
      setData(arg);
      console.log('Data has been returned from main process');  
    });
    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);

  return (
    <div id="App">
      {/* <h1>Hello Worldddddd</h1> */}
      {/* <Header /> */}
      <div class="title-bar">
        <div class="titlebar-drag-region"></div>
        <div class="title">Window Header</div>
        <div class="title-bar-btns">
          <button id="min-btn">-</button>
          <button id="max-btn">+</button>
          <button id="close-btn">x</button>
        </div>
      </div>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/testquery">
            <TestQuery />
          </Route>
          <Route path="/playground">
            <Playground />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
