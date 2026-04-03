import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { selectMonthlyData } from '../../app/transactions/transactionsSelectors';
import { selectTheme } from '../../app/auth/roleSlice';
import { formatCurrency, getMonthLabel } from '../../utils/formatters';

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{getMonthLabel(label)}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs font-medium" style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

// Monthly bar chart component
export default function MonthlyBarChart({ limit = 5 }) {
  // Selecting data from the store
  const allData = useSelector(selectMonthlyData);
  const theme   = useSelector(selectTheme);
  const data    = allData.slice(-limit);

  // Setting axis and grid colors based on theme
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }} barSize={18} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tickFormatter={getMonthLabel}
            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{v}</span>} />
          <Bar dataKey="income"  fill="hsl(142,71%,45%)" radius={[4,4,0,0]} name="Income" />
          <Bar dataKey="expense" fill="hsl(0,84%,60%)"   radius={[4,4,0,0]} name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
