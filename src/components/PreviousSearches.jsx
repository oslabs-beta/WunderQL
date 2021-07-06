import { DataGrid } from '@material-ui/data-grid';
import { useState, useEffect } from 'react';

const rows = [
  {
    id: 1,
    'Query Name': 'Rocket ships',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString()
    
  },
  {
    id: 2,
    'Query Name': 'Rocket ships',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString()
    
  },
  {
    id: 3,
    'Query Name': 'Rocket ships',
    'Num of runtimes': 38,
    'Avg Runtime(ms)': 150,
    'Last Date Ran': new Date().toDateString()
    
  },
];


const PreviousSearches = (props) => {

  const data = [];
  // const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/saved')
      .then(res => res.json())
      .then(queries => {
        queries.map((query, index) => (
          data.push({
            id: index,
            'Query Name': query.name,
            'Num of runtimes': query.numRuntimes,
            'Avg Runtime(ms)': query.avgRuntime,
            'Last Date Ran': query.lastDateRan
          })
        ))
      })
  })

  


  return (
    <div id='previous-searches'>

      <h1>All your past searches:</h1>
      <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'Query Name', width: 200 }, 
          { field: 'Num of runtimes', width:200 },
          { field: 'Avg Runtime(ms)', width:200 },
          { field: 'Last Date Ran', width:200 },
        ]}
        rows={rows}
        />
      </div>

    </div>
    
  )
};

export default PreviousSearches;