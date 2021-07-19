import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Day 1',
    regularQueries: 590,
    loadTests: 800,
    amt: 1400,
  },
  {
    name: 'Day 2',
    regularQueries: 868,
    loadTests: 967,
    amt: 1506,
  },
  {
    name: 'Day 3',
    regularQueries: 1397,
    loadTests: 1098,
    amt: 989,
  },
  {
    name: 'Day 4',
    regularQueries: 1480,
    loadTests: 1200,
    amt: 1228,
  },
  {
    name: 'Day 5',
    regularQueries: 1520,
    loadTests: 1108,
    amt: 1100,
  },
  {
    name: 'Day 6',
    regularQueries: 1400,
    loadTests: 680,
    amt: 1700,
  },
];

const BarChartComponent = () => {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="regularQueries" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="loadTests" stroke="#ff7300" strokeWidth={3}/>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;