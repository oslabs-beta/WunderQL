import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, LabelList, Label } from 'recharts';

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
    
    // const getDifference = () => {
    //   return Math.abs(payload[0].payload.best_fit - payload[0].payload.runtime).toFixed(1);
    // }
    return (
      <div className="custom-tooltip">
        <p className="label">{`Num of ${payload[0].name}ed load tests`}</p>
        {/* <p className="intro">{getDate(label)}</p> */}
        {/* <p className="desc">{`${getDifference()}ms from average`}</p> */}
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

const PieChartComponent = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          {/* <Pie 
            data={data01} 
            dataKey="value" 
            cx="50%" 
            cy="50%" 
            outerRadius={60} 
            fill="#8884d8" /> */}
          <text x={400} y={200} textAnchor="middle" dominantBaseline="middle">
            Donut
          </text>
          <Pie 
            data={data02} 
            dataKey="value" 
            cx="50%" 
            cy="50%" 
            innerRadius={70} 
            outerRadius={90} 
            fill="#82ca9d" 
            label />
            {/* <LabelList dataKey="name" position="top" /> */}
          <Tooltip content={<CustomTooltip />} />
          <Label width={30} position="center"
              content={<CustomLabel value1={'hi'} value2={'hi'}/>}>
          </Label>        
        </PieChart>
      </ResponsiveContainer>
    );
}

export default PieChartComponent;