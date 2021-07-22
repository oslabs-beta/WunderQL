import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// display data of num child processes versus average response time

const ScatterChartComponent = ({ loadTestHistory }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        width={500}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis 
          type="number" 
          dataKey="number_of_child_processes" 
          name="Num Child Processes" 
          // domain={['0', 'dataMax+2']}
        />
        <YAxis 
          yAxisId="left" 
          type="number" 
          dataKey="average_response_time" 
          name="Avg Response Time" 
          unit="ms" 
          stroke="#8884d8" 
          domain={['0', 'dataMax + 50']}
          allowDecimals={false} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter yAxisId="left" name="A school" data={loadTestHistory} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChartComponent;