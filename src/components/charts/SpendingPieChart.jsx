import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { selectCategoryBreakdown } from '../../app/transactions/transactionsSelectors';
import { formatCurrency } from '../../utils/formatters';

// Colors for the pie chart
const COLORS = [
  'hsl(221,83%,58%)','hsl(142,71%,45%)','hsl(38,92%,55%)','hsl(0,84%,60%)',
  'hsl(262,83%,65%)','hsl(199,89%,48%)','hsl(326,78%,60%)','hsl(168,64%,42%)',
];

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="text-sm font-semibold" style={{ color: d.payload.fill }}>{d.name}</p>
      <p className="text-xs text-slate-400">{formatCurrency(d.value)} ({d.payload.percent?.toFixed(1)}%)</p>
    </div>
  );
};


// Spending pie chart component
export default function SpendingPieChart() {

  // Selecting data from the store
  const rawData = useSelector(selectCategoryBreakdown);
  const total   = rawData.reduce((s, d) => s + d.value, 0);
  const data    = rawData.slice(0, 8).map((d) => ({ ...d, percent: total > 0 ? (d.value / total) * 100 : 0 }));

  // Handling the case where there is no data
  if (data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-sm text-slate-400">No expense data</div>;
  }

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: '#94a3b8' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
