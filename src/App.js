import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import TestQuery from './components/Test-Query'
import './stylesheets/index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div id="App">
      <h1>Hello Worldddddd</h1>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/testquery">
            <TestQuery />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
