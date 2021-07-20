import PieChartComponent from './DashboardPieChart';
import BarChartComponent from './DashboardBarChart';
import RadarChartComponent from './DashboardRadarChart';
import { useDarkTheme } from './ThemeContext';
import { useEffect } from 'react';

const Dashboard = ({ url, totalRuntimes, totalLoadTests, totalUniqueQueries, setTotalRuntimes, setTotalUniqueQueries, setTotalLoadTests }) => {

  // const [totalRuntimes, setTotalRuntimes] = useState(0);
  // const [totalLoadTests, setTotalLoadTests] = useState(0);
  // const [totalUniqueQueries, setTotalUniqueQueries] = useState(0);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? 'white' : '#333'
  }

  // obtain and set totals from BE
  // console.log('beforeeee')
  // useEffect(() => {
  //   console.log('insideeee')
  //   window.api.receive("totalsFromMain", (event, data) => {
  //     //data = [{ _id}]
  //     console.log('totals data from be: ', data)
  //     setTotalUniqueQueries(data.number_of_queries)
  //     setTotalRuntimes(data.number_of_tests)
  //     setTotalLoadTests(data.number_of_load_tests)
  //   })
  // },[setTotalUniqueQueries, setTotalRuntimes, setTotalLoadTests])

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
            <div class='dash-num'><h1>{totalLoadTests}</h1></div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard;