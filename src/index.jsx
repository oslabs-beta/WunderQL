  
const React = require('react');
const ReactDOM = require('react-dom');
import App from './App.jsx';

const root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(<App/>, document.getElementById('root'));