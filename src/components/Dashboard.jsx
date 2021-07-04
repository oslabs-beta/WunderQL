// import React from 'react'
// import TestQuery from './Test-Query';
import ScatterPlotTest from './ScatterPlotTest'
import LineChartComponent from './LineChart';

const Dashboard = () => {
  
  
  return (
    <div id='dashboard'>
      <h1>Your Application Summary</h1>
      {/* <ResponsiveContainer width="100%" height="100%"> */}
        <div id='top-left'>
          <LineChartComponent />
        </div>
        <div id='top-right'>
          <LineChartComponent />
          {/* <ScatterPlotTest /> */}
        </div>
        <div id='bottom-left'>
          <LineChartComponent />
          {/* <ScatterPlotTest /> */}
        </div>
        <div id='bottom-right'>
          <LineChartComponent />
          {/* <ScatterPlotTest /> */}
        </div>
      {/* </ResponsiveContainer> */}
    </div>
  )
}

export default Dashboard;