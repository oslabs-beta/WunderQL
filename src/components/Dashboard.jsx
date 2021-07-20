/* eslint-disable react/react-in-jsx-scope */
import PieChartComponent from './DashboardPieChart';
import BarChartComponent from './DashboardBarChart';
import RadarChartComponent from './DashboardRadarChart';
import { useDarkTheme } from './ThemeContext';
import { useEffect, useState } from 'react';

const Dashboard = ({ url, urlID }) => {

  const [totalRuntimes, setTotalRuntimes] = useState(0);
  const [totalLoadTests, setTotalLoadTests] = useState(0);
  const [totalUniqueQueries, setTotalUniqueQueries] = useState(0);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? 'white' : '#333'
  };

  window.api.send('dashboardToMain', urlID);

  // obtain and set totals from BE
  window.api.receive('totalsFromMain', (data) => {
    setTotalUniqueQueries(data.number_of_queries);
    setTotalRuntimes(data.number_of_tests);
    setTotalLoadTests(data.number_of_load_tests);
  });

  return (
    <div id='dashboard' style={themeStyle}>
      <header className='uri'>
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
          <div className='dash-title'><h3>Total Unique Queries</h3></div>
          <div className='dash-num'><h1>{totalUniqueQueries}</h1></div>
        </div>
        <div className='dashboard-stats'>
          <div className='dash-title'><h3>Total URL Calls</h3></div>
          <div className='dash-num'><h1>{totalRuntimes}</h1></div>
        </div>
        <div className='dashboard-stats'>
          <div className='dash-title'><h3>Total Load Tests</h3></div>
          <div className='dash-num'><h1>{totalLoadTests}</h1></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;