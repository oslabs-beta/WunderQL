import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = (props) => {
  
  // construct fake data of random runtimes(ms) per query
  const data = [];
  const sample = [];
  for (let i = 0; i < 50; i++) sample.push((Math.random()*100).toFixed(2));
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
              left: 10,
              bottom: 5,
            }}
            >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis label={{ value: 'time(ms)', angle: -90, position:'insideLeft' }}/>
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
};

export default LineChartComponent;