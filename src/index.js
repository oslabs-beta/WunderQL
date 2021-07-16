import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  document.getElementById('root')
);
