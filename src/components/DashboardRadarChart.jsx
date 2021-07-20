import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const fakedata = [
  {
    subject: 'Raubern',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Frank',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Patrick',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Laura',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Esma',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Ryan',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const RadarChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={fakedata}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        <Radar name="Billy" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="Aki" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default RadarChartComponent;