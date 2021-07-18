import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data01 = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];
const data02 = [
  { x: 300, y: 300, z: 200 },
  { x: 400, y: 500, z: 260 },
  { x: 200, y: 700, z: 400 },
  { x: 340, y: 350, z: 280 },
  { x: 560, y: 500, z: 500 },
  { x: 230, y: 780, z: 200 },
  { x: 500, y: 400, z: 200 },
  { x: 300, y: 500, z: 260 },
  { x: 240, y: 300, z: 400 },
  { x: 320, y: 550, z: 280 },
  { x: 500, y: 400, z: 500 },
  { x: 420, y: 280, z: 200 },
];

const data = [
  { numChildProcesses: 50, avgResponseTime: 500 },
  { numChildProcesses: 50, avgResponseTime: 400 },
  { numChildProcesses: 50, avgResponseTime: 550 },
  { numChildProcesses: 50, avgResponseTime: 600 },
  { numChildProcesses: 75, avgResponseTime: 700 },
  { numChildProcesses: 25, avgResponseTime: 200 },
  { numChildProcesses: 100, avgResponseTime: 900 },
]

// display data of num child processes versus average response time

const ScatterChartComponent = () => {
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
          dataKey="numChildProcesses" 
          name="Num Child Processes" 
          // unit="" 
          />
        <YAxis 
          yAxisId="left" 
          type="number" 
          dataKey="avgResponseTime" 
          name="Avg Response Time" 
          unit="ms" 
          stroke="#8884d8" />
        {/* <YAxis
          yAxisId="right"
          type="number"
          dataKey="z"
          name="weight"
          unit="kg"
          orientation="right"
          stroke="#82ca9d"
        /> */}
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter yAxisId="left" name="A school" data={data} fill="#8884d8" />
        {/* <Legend /> */}
        {/* <Scatter yAxisId="right" name="A school" data={data02} fill="#82ca9d" /> */}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default ScatterChartComponent;