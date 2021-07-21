  
const React = require('react');
const ReactDOM = require('react-dom');
const render = require('react-dom')
import App from './App.jsx';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
const root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root);

ReactDOM.render(<App/>, document.getElementById('root'));


