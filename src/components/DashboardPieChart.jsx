/* eslint-disable react/react-in-jsx-scope */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {  
    console.log(payload[0]);
  
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].value} load tests ${payload[0].name}ed`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = ['#00C49F', '#AA0601'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = ({ totalLoadTestSuccesses, totalLoadTestFailures }) => {

  const data = [
    {name: 'pass', value: Number(totalLoadTestSuccesses)},
    {name: 'fail', value: Number(totalLoadTestFailures)}
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="name"
          cx="50%" 
          cy="50%" 
          fill="#82ca9d" 
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip fill='white'/>} />
        <Legend align='center'/>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;