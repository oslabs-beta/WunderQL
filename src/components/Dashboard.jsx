// import React from 'react'
// import TestQuery from './Test-Query';
import LineChartComponent from './LineChart';
import PieChartComponent from './DashboardPieChart';
import BarChartComponent from './DashboardBarChart';
import ScatterChartComponent from './DashboardScatterChart';
import RadarChartComponent from './DashboardRadarChart';
import { useDarkTheme } from './ThemeContext';

const Dashboard = ({ uri }) => {
  
  // total num unique queries (history prop - array of queries)
  // total num queries sent (can this be sent from db?)
  // total num load tests 
  // pass fail pie chart
  // some other circular chart
  // bar graph of num queries sent per day

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? '#CCC' : '#333'
  }

  return (
    <div id='dashboard' style={themeStyle}>
      <header class='uri'>
        <h2>Summary for: {uri}</h2>
      </header>
        <div id='top-left'>
          <RadarChartComponent />
        </div>
        <div id='top-mid'>
          <PieChartComponent />
        </div>
        <div id='bottom'>
          <BarChartComponent />
        </div>
        <div id='left'>
          <div class='dashboard-stats'>
            <div class='dash-title'><h3>Total Unique Queries</h3></div>
            <div class='dash-num'><h1>100</h1></div>
          </div>
          <div class='dashboard-stats'>
            <div class='dash-title'><h3>Total URI Calls</h3></div>
            <div class='dash-num'><h1>100000</h1></div>
          </div>
          <div class='dashboard-stats'>
            <div class='dash-title'><h3>Total Load Tests</h3></div>
            <div class='dash-num'><h1>100</h1></div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard;