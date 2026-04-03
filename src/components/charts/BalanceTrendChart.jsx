import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { selectBalanceTrend } from '../../app/transactions/transactionsSelectors';
import { selectTheme } from '../../app/auth/roleSlice';
import { formatCurrency, formatShortDate } from '../../utils/formatters';

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{formatShortDate(label)}</p>
      <p className="chart-tooltip-value text-primary">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

// Balance trend chart component
export default function BalanceTrendChart() {
  // Selecting data from the store
  const data  = useSelector(selectBalanceTrend);
  const theme = useSelector(selectTheme);

  // Setting axis and grid colors based on theme
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  // Sampling data to prevent chart from becoming too crowded
  const sampled = data.length > 30
    ? data.filter((_, i) => i % Math.ceil(data.length / 30) === 0)
    : data;


  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampled} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(221,83%,58%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(221,83%,58%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatShortDate}
            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="balance" stroke="hsl(221,83%,58%)" strokeWidth={2.5}
            fill="url(#balanceGradient)" dot={false} activeDot={{ r: 5, fill: 'hsl(221,83%,58%)', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
