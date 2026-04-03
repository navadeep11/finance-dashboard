import { useSelector } from 'react-redux';
import { TrendingDown, BarChart3, Trophy, DollarSign, ArrowUpRight, ArrowDownLeft, Flame } from 'lucide-react';
import {
  selectInsights, selectCategoryBreakdown, selectMonthlyData,
} from '../app/transactions/transactionsSelectors';
import { formatCurrency, formatDate, formatPercent, getMonthLabel } from '../utils/formatters';
import Card, { CardHeader, CardTitle, CardSubtitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import MonthlyBarChart  from '../components/charts/MonthlyBarChart';
import SpendingPieChart from '../components/charts/SpendingPieChart';


// Dot colors for the charts
const DOT_COLORS = {
  'Food & Dining':'#3b82f6','Housing':'#8b5cf6','Transportation':'#f59e0b',
  'Entertainment':'#ec4899','Healthcare':'#10b981','Shopping':'#f97316',
  'Utilities':'#06b6d4','Salary':'#22c55e','Freelance':'#6366f1',
  'Investment Returns':'#eab308','Other':'#94a3b8',
};

// KPI cards configuration
const KPI_CARDS = (insights) => {
  const { highestCategory, currentMonth, prevMonth, avgDailySpend } = insights;
  const savingsNow  = currentMonth ? currentMonth.income - currentMonth.expense : null;
  const momChange   = currentMonth && prevMonth
    ? ((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100 : null;

  return [
    {
      id: 'insight-top-category',
      icon: Flame, iconBg: 'bg-expense/10', iconColor: 'text-expense',
      label: 'Highest Spending', value: highestCategory?.name ?? 'N/A',
      sub: highestCategory ? formatCurrency(highestCategory.value) + ' total' : '—',
    },
    {
      id: 'insight-avg-spend',
      icon: DollarSign, iconBg: 'bg-warning/10', iconColor: 'text-warning',
      label: 'Avg. Daily Spend', value: formatCurrency(avgDailySpend),
      sub: 'Per day across all time',
    },
    {
      id: 'insight-month-savings',
      icon: savingsNow >= 0 ? ArrowUpRight : ArrowDownLeft,
      iconBg: savingsNow >= 0 ? 'bg-income/10' : 'bg-expense/10',
      iconColor: savingsNow >= 0 ? 'text-income' : 'text-expense',
      label: currentMonth ? getMonthLabel(currentMonth.month) + ' Savings' : 'Current Month',
      value: savingsNow !== null ? formatCurrency(savingsNow) : 'N/A',
      valueColor: savingsNow >= 0 ? 'text-income' : 'text-expense',
      sub: currentMonth ? `Income: ${formatCurrency(currentMonth.income)} · Exp: ${formatCurrency(currentMonth.expense)}` : '—',
    },
    {
      id: 'insight-mom-change',
      icon: BarChart3,
      iconBg: momChange !== null && momChange <= 0 ? 'bg-income/10' : 'bg-expense/10',
      iconColor: momChange !== null && momChange <= 0 ? 'text-income' : 'text-expense',
      label: 'MoM Expense Change',
      value: momChange !== null ? `${momChange > 0 ? '+' : ''}${formatPercent(momChange)}` : 'N/A',
      valueColor: momChange !== null && momChange <= 0 ? 'text-income' : 'text-expense',
      sub: prevMonth && currentMonth ? `${getMonthLabel(prevMonth.month)} → ${getMonthLabel(currentMonth.month)}` : 'Not enough data',
    },
  ];
};



export default function InsightsPage() {
  const insights    = useSelector(selectInsights);
  const breakdown   = useSelector(selectCategoryBreakdown);
  const expenseCats = breakdown.filter((c) => !['Salary','Freelance','Investment Returns'].includes(c.name));
  const totalExp    = expenseCats.reduce((s, c) => s + c.value, 0);
  const { top5, highestCategory, currentMonth, avgDailySpend } = insights;

  return (
    <div className="flex flex-col gap-6 py-6 animate-fade-slide-up">

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS(insights).map(({ id, icon: Icon, iconBg, iconColor, label, value, valueColor, sub }, i) => (
          <Card key={id} id={id} hover className={`flex items-start gap-4 animate-fade-slide-up stagger-${i+1}`}>
            <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1 ${valueColor || ''}`}>{value}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          </Card>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card padding={false} className="lg:col-span-2 overflow-hidden">
          <div className="px-5 pt-5"><CardHeader><CardTitle>All Months</CardTitle><CardSubtitle>Income vs Expenses</CardSubtitle></CardHeader></div>
          <div className="px-4 pb-5"><MonthlyBarChart limit={12} /></div>
        </Card>
        <Card padding={false} className="overflow-hidden">
          <div className="px-5 pt-5"><CardHeader><CardTitle>Spending Breakdown</CardTitle><CardSubtitle>By category</CardSubtitle></CardHeader></div>
          <div className="px-4 pb-5"><SpendingPieChart /></div>
        </Card>
      </section>

      {/* Category breakdown table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardSubtitle>Expense distribution</CardSubtitle>
        </CardHeader>
        {expenseCats.length === 0
          ? <p className="text-sm text-slate-400">No expense data available.</p>
          : (
            <div className="flex flex-col gap-4">
              {expenseCats.map((cat, i) => {
                const pct = totalExp > 0 ? (cat.value / totalExp) * 100 : 0;
                const color = DOT_COLORS[cat.name] || '#94a3b8';
                return (
                  <div key={cat.name} className="grid grid-cols-[1fr_1fr_auto] sm:grid-cols-[1.5fr_2fr_auto] items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{cat.name}</span>
                      {i === 0 && <span className="hidden sm:inline-block"><Badge variant="expense">Top</Badge></span>}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <div className="flex-1 h-1.5 sm:h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400 w-8 sm:w-10 text-right">{pct.toFixed(1)}%</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-right">{formatCurrency(cat.value)}</span>
                  </div>
                );
              })}
            </div>
          )
        }
      </Card>

      {/* Top 5 */}
      <Card>
        <CardHeader action={<Trophy size={18} className="text-warning" />}>
          <CardTitle>Top 5 Transactions</CardTitle>
          <CardSubtitle>Highest value across all time</CardSubtitle>
        </CardHeader>
        <div>
          {top5.map((tx, i) => (
            <div key={tx.id} className="flex items-center gap-2 sm:gap-4 py-4 border-b border-slate-100 dark:border-dark-border last:border-0">
              <span className={`text-lg sm:text-xl font-bold w-6 sm:w-8 text-center flex-shrink-0
                ${i===0?'text-yellow-400':i===1?'text-slate-400':i===2?'text-amber-600':'text-slate-400'}`}>
                #{i+1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{tx.description}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">{tx.category} · {formatDate(tx.date)}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <span className={`text-xs sm:text-sm font-semibold tabular-nums ${tx.type==='income'?'text-income':'text-expense'}`}>
                  {tx.type==='income'?'+':'-'}{formatCurrency(tx.amount)}
                </span>
                <span className="hidden sm:inline-block"><Badge variant={tx.type}>{tx.type}</Badge></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Observation */}
      <div className="flex items-start gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/20">
        <span className="text-3xl flex-shrink-0">💡</span>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Spending Observation</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {highestCategory
              ? <>Your largest expense category is <strong className="text-slate-700 dark:text-slate-300">{highestCategory.name}</strong> at {formatCurrency(highestCategory.value)} ({totalExp>0?((highestCategory.value/totalExp)*100).toFixed(1):0}% of all expenses). Your average daily spend is {formatCurrency(avgDailySpend)}.</>
              : 'Add some transactions to see spending insights.'}
          </p>
        </div>
      </div>
    </div>
  );
}
