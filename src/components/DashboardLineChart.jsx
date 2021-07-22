/* eslint-disable react/react-in-jsx-scope */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ history }) => {
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {  
      console.log(payload[0]);
      
      const getDifference = () => {
        return Math.abs(payload[0].payload.best_fit - payload[0].payload.runtime).toFixed(1);
      };
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}: ${payload[0].value}ms`}</p>
          <p className="desc">{`${getDifference()}ms from average`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        id='line-chart'
        data={history}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          angle='0'
          tick={{fontSize: 10}}
        />
        <YAxis 
          type='number'
          label={{ value: 'time(ms)', angle: -90, position:'insideLeft' }} 
          domain={['dataMin-50', 'dataMax+50']} 
          allowDecimals='false'
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="runtime" 
          dot={{stroke: '#e01d1d', strokeWidth: 1}} 
          strokeWidth={0}
          animationEasing='linear'
          isAnimationActive={false}
        />
        <Line type="monotone" dataKey="best_fit" stroke="#8884d8" dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;