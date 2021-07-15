import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const colors = scaleOrdinal(schemeCategory10).range();

const data = [
  {
    name: 'Page A',
    uv: 4000,
    female: 2400,
    male: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    female: 1398,
    male: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    female: 9800,
    male: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    female: 3908,
    male: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    female: 4800,
    male: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    female: 3800,
    male: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    female: 4300,
    male: 2100,
  },
];

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default class BarChartComponent extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/bar-chart-with-customized-shape-dusth';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="female" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
