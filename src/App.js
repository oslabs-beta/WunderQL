import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import TestQuery from './components/Test-Query'
import Header from './components/Header'
import Playground from './components/Playground';
import './stylesheets/index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div id="App">
      {/* <h1>Hello Worldddddd</h1> */}
      <Header />
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <div id='landing'>
              <h1>Welcome back, beautiful!</h1>
              <h3>Click a tab to get started...</h3>
            </div>
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
