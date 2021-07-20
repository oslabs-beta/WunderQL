import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, LabelList, Label, Legend } from 'recharts';

const data01 = [
  { name: 'Group A', value: 400 },
  // { name: 'Group B', value: 300 },
  // { name: 'Group C', value: 300 },
  // { name: 'Group D', value: 200 },
];
const data02 = [
  { name: 'Pass', value: 100 },
  { name: 'Fail', value: 300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {  
    console.log(payload[0])
  
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].value} ${payload[0].name}ed load tests`}</p>
      </div>
    );
  }
  return null;
};

function CustomLabel({viewBox, value1, value2}){
  const {cx, cy} = viewBox;
  return (
   <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
      <tspan alignmentBaseline="middle" fontSize="26">{value1}</tspan>
      <tspan fontSize="14">{value2}</tspan>
   </text>
  )
}

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
    {name: 'fail', value: 1}
    // {name: 'fail', value: Number(totalLoadTestFailures)}
  ]
  console.log('data: ', data)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          {/* <Pie 
            data={data} 
            dataKey="value" 
            cx="50%" 
            cy="50%" 
            outerRadius={60} 
            fill="#8884d8" />
            label /> */}
          {/* <text 
            cx="50%" 
            cy="50%"
            textAnchor="middle" 
            dominantBaseline="middle"
            >PIE CHART TITLE
          </text> */}
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name"
            cx="50%" 
            cy="50%" 
            // innerRadius={70} 
            // outerRadius={90} 
            fill="#82ca9d" 
            label={renderCustomizedLabel}
            >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            {/* <LabelList dataKey="name" position="top" /> */}
          <Tooltip content={<CustomTooltip />} />
          {/* <Label width={30} position="center"
              content={<CustomLabel value1={'hi'} value2={'hi'}/>}>
          </Label>    */}
          <Legend align='center'/>
          {/* <LabelList />    */}
        </PieChart>
      </ResponsiveContainer>
    );
}

export default PieChartComponent;