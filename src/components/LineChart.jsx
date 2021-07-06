import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = (props) => {
  
  // construct fake data of random runtimes(ms) per query
  const data = [];
  const sample = [];
  // generate random numbers (runtimes) for sample array
  for (let i = 0; i < 30; i++) sample.push((Math.random()*3 + 148).toFixed(2));
  sample.push(160);
  for (let i = 0; i < 20; i++) sample.push((Math.random()*3 + 148).toFixed(2));

  // create data points for each number in sample array
  sample.map((time, index) => data.push({day:index, time:time}));
  
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
            id='line-chart'
            data={data}
            // data={props.data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
            >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="day" 
          domain={['dataMax - 20', 'dataMax']}
        />
        <YAxis 
          label={{ value: 'time(ms)', angle: -90, position:'insideLeft' }} 
          domain={['dataMin - 10', 'dataMax + 10']} 
          allowDecimals='false'
        />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
};

export default LineChartComponent;