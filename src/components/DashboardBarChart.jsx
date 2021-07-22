import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ barChartData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={barChartData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" scale="band" />
        <YAxis type="number" domain={[0, 'dataMax+5']}/>
        <Tooltip />
        <Legend />
        <Bar dataKey="query_tests" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="query_load_tests" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;