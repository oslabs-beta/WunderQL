import { ScatterChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

const LineChartComponent = ({ history }) => {
  const data = [];
  
  console.log('data to be plotted: ', data)
  // const date = history.date;
  // const payloadFormatter = (value, name, props) => (['date', 'date2']);

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
            id='line-chart'
            data={history}
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
          dataKey="index" 
          // domain={['dataMax - 20', 'dataMax']}
        />
        <YAxis 
          label={{ value: 'time(ms)', angle: -90, position:'insideLeft' }} 
          domain={['dataMin - 10', 'dataMax + 10']} 
          allowDecimals='false'
        />
        <Tooltip 
          // payload="[{day: 'date'}]"
          // formatter={payloadFormatter}
          // label={date}
          // content={<CustomTooltip date={history} />}
        />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="runtime" dot={{stroke: 'red', strokeWidth: 1}} strokeWidth={0}activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="best_fit" dot={false} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
};

export default LineChartComponent;