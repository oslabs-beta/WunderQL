<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/oslabs-beta/WunderQL">
    <img src="https://www.wunderql.com/static/media/wunderql-name.bc187555.png" alt="Logo" length="350px" width="350px">
  </a>

  <h3 align="center">WunderQL</h3> 

  <p align="center">
    Performance Testing with WunderQL
    <br /><br />
    <a href="https://wunderql.com/"><strong>WunderQL.com</strong></a>
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#Features">Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Getting Started</a></li>
      </ul>
    </li>
    <li><a href="#contributors">Contributors</a></li>
    <li><a href="#looking-ahead">Looking Ahead</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->

## About The Project

WunderQL is a cross-platform desktop application used for testing a GraphQL server's performance. Developed under tech accelerator OSLabs, WunderQL was created with the developer in mind.

We wanted a simple, no fuss developer tool that allows the user to measure the performance of their GraphQL server throughout the development life cycle. You can measure the response time of your GraphQL queries, simulate a production environment with load testing, and search your past queries to see if there was any degradation in performance over time. 


### Built With

- [React](https://reactjs.org/)
- [Webpack](https://webpack.js.org/)
- [Node.js/Express](https://nodejs.dev)
- [Electron](https://electronjs.org/)
- [GraphQL](https://graphql.org/)
- [Cypress](https://www.cypress.io/) TBD


## Features

1. To measure the response time of your GraphQL server, please select the 'Test Query' option from the nav bar. You can enter in a new query or select a previous query you ran on the top right hand drop down. This will auto fill the query select form. Clicking the Send Query button will get you the response and the average response time of your query. ![Test Query](https://www.wunderql.com/static/media/gif_testquery.01e3e3de.gif)

2. To perform a load test, select Load Test in the nav bar. Enter in your GraphQL Query, nickname for your query (to be saved for future reference) and then the number of requests per second. Click on the 'Send Query' button to get your results! ![Load test](https://www.wunderql.com/static/media/gif_loadtest.025e7bda.gif)


## Getting Started

To get a local copy up and running, follow these steps:
1. Clone the repo. 
2. Run `npm install`. 
4. Run `npm run prod` to start the application.
5. Create or login to your [ElephantSQL](https://www.elephantsql.com/) account.
6. Run the following script to create your local database:
```sh
CREATE TABLE public.response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "response_time" float NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);
CREATE TABLE public.load_test_response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "number_of_child_processes" bigint NOT NULL,
  "average_response_time" float NOT NULL,
  "result" varchar NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.users (
  "_id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL
) WITH (
  OIDS=FALSE
);
CREATE TABLE public.graphqlurls (
  "_id" serial PRIMARY KEY,
  "nickname" varchar NOT NULL,
  "url" varchar NOT NULL,
  "user_id" bigint NOT NULL,
  UNIQUE (url, user_id),
  FOREIGN KEY (user_id) REFERENCES users (_id)
) WITH (
  OIDS=FALSE
);
CREATE TABLE public.queries (
  "_id" serial PRIMARY KEY,
  "query_name" varchar NOT NULL,
  "query_string" varchar NOT NULL,
  "url_id" bigint NOT NULL,
  UNIQUE (query_string, url_id),
  FOREIGN KEY (url_id) REFERENCES graphqlurls (_id)
) WITH (
  OIDS=FALSE
);
CREATE TABLE public.response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "response_time" float NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);
CREATE TABLE public.load_test_response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "number_of_child_processes" bigint NOT NULL,
  "average_response_time" float NOT NULL,
  "result" varchar NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);
```




### Prerequisites

*  A [ElephantSQL](https://www.elephantsql.com/) account to host your local database


## Contributors

Frank Lin - [GitHub](https://github.com/flin1105) - [LinkedIn](www.linkedin.com/in/frank-lin-1105)

Raubern Totanes - [GitHub](https://github.com/rauberntotanes) - [LinkedIn](https://www.linkedin.com/in/rauberntotanes/)

Patrick Ziegler - [GitHub](https://github.com/pziggy3) - [LinkedIn](https://www.linkedin.com/in/patrickziegler/)

Laura Llano - [GitHub](https://github.com/ldllano) - [LinkedIn](https://www.linkedin.com/in/laura-llano/)


## Looking Ahead

Never look ahead. Only look at TODAY. #cheesy


## Badges
<!-- if testing with cypress, can display this badge -->
<!-- [![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)
 -->
