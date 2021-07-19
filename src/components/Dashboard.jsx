import PieChartComponent from './DashboardPieChart';
import BarChartComponent from './DashboardBarChart';
import RadarChartComponent from './DashboardRadarChart';
import { useDarkTheme } from './ThemeContext';
import { useEffect } from 'react';

const Dashboard = ({ url, totalRuntimes, setTotalRuntimes, totalUniqueQueries }) => {

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? 'white' : '#333'
  }
// console.log('beforeeee')
// useEffect(() => {
//     console.log('insideeee')
//     window.api.receiveArray("responseTimesFromMain", (event, arg) => {
//       console.log('insideeee2')
//         // set total amount of runtimes to date
//         console.log('total calls: ', arg[arg.length - 1]._id);
//         setTotalRuntimes(arg[arg.length - 1]._id);
//       })
//   })

  return (
    <div id='dashboard' style={themeStyle}>
      <header class='uri'>
        <h2>Summary for: {url}</h2>
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
          <div className='dashboard-stats'>
            <div class='dash-title'><h3>Total Unique Queries</h3></div>
            <div class='dash-num'><h1>{totalUniqueQueries}</h1></div>
          </div>
          <div class='dashboard-stats'>
            <div class='dash-title'><h3>Total URL Calls</h3></div>
            <div class='dash-num'><h1>{totalRuntimes}</h1></div>
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