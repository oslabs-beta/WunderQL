import React from 'react';
import PieChartComponent from './DashboardPieChart.jsx';
import BarChartComponent from './DashboardBarChart.jsx';
import { useDarkTheme } from './ThemeContext.jsx';
import { useEffect, useState } from 'react';

const Dashboard = ({ url, urlID }) => {

  const [totalRuntimes, setTotalRuntimes] = useState(0);
  const [totalLoadTests, setTotalLoadTests] = useState(0);
  const [totalUniqueQueries, setTotalUniqueQueries] = useState(0);
  const [totalLoadTestSuccesses, setTotalLoadTestSuccesses] = useState(0);
  const [totalLoadTestFailures, setTotalLoadTestFailures] = useState(0);
  const [barChartData, setBarChartData] = useState([]);

  const darkTheme = useDarkTheme();
  const themeStyle = {
    backgroundColor: darkTheme ? '#333' : 'white',
    color: darkTheme ? 'white' : '#333'
  };

  useEffect(() => {
    window.api.send('dashboardToMain', urlID);
  

    window.api.receive('totalsFromMain', (data) => {
      console.log('data: ', data);
      setTotalUniqueQueries(data.number_of_queries);
      setTotalRuntimes(data.number_of_tests);
      setTotalLoadTests(data.number_of_load_tests);
      setTotalLoadTestSuccesses(data.number_of_load_test_successes);
      setTotalLoadTestFailures(data.number_of_load_test_failures);
      setBarChartData(data.all_queries_and_load_tests);
    });
  }, []);
    
  return (
    <div id='dashboard' style={themeStyle}>
      <header className='uri'>
        <p>Summary for: <span><strong>{url}</strong></span></p>
      </header>
      <div id='top-left'>
        <div className='dashboard-stats'>
          <div className='dash-title'><h3>Total Unique Queries</h3></div>
          <div className='dash-num'><h1>{totalUniqueQueries}</h1></div>
        </div>
  
      </div>
      <div id='top-mid'>
        <div className='dashboard-stats'>
          <div className='dash-title'><h3>Total URL Calls</h3></div>
          <div className='dash-num'><h1>{totalRuntimes}</h1></div>
        </div>
      </div>
      <div id='top-right'>
        <div className='dashboard-stats'>
          <div className='dash-title'><h3>Total Load Tests</h3></div>
          <div className='dash-num'><h1>{totalLoadTests}</h1></div>
        </div>
      </div>
      <div id='bottom-left'>
        <BarChartComponent barChartData={barChartData} />
      </div>
      <div id='bottom-right'>
        <PieChartComponent totalLoadTestSuccesses={totalLoadTestSuccesses} totalLoadTestFailures={totalLoadTestFailures}/>
      </div>
    </div>
  );
};

export default Dashboard;