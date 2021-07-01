import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'https://api.spacex.land/graphql/',
//   cache: new InMemoryCache(),
// });

// client.query({
//   query: gql`
// query {
//   launchesPast(limit: 10) {
//     mission_name
//     launch_date_local
//     launch_site {
//       site_name_long
//     }
//   }
// }
//   `
// }).then(result => console.log(result))

ReactDOM.render(
  // <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  // </ApolloProvider>,
  document.getElementById('root')
);
