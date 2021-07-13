// import React from 'react'
// import TestQuery from './Test-Query';
import LineChartComponent from './LineChart';
import PieChartComponent from './DashboardPieChart';
import BarChartComponent from './DashboardBarChart';
import ScatterChartComponent from './DashboardScatterChart';
import RadarChartComponent from './DashboardRadarChart';
import { useDarkTheme } from './ThemeContext';

const Dashboard = ({ uri }) => {
  
  //fake data for all queries of a single uri
  const uriData = [

  ]

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
          <BarChartComponent />
        </div>
        <div id='top-right'>
          <PieChartComponent />
        </div>
        <div id='bottom-left'>
          <RadarChartComponent />
        </div>
        <div id='bottom-right'>
          <ScatterChartComponent />
        </div>
    </div>
  )
}

export default Dashboard;