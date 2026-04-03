import { useSelector } from 'react-redux';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Download, Shield, Eye } from 'lucide-react';
import { selectSummary, selectTransactionStatus } from '../app/transactions/transactionsSelectors';
import { selectRole } from '../app/auth/roleSlice';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Card, { CardHeader, CardTitle, CardSubtitle } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import BalanceTrendChart from '../components/charts/BalanceTrendChart';
import SpendingPieChart  from '../components/charts/SpendingPieChart';
import MonthlyBarChart   from '../components/charts/MonthlyBarChart';

// Summary cards configuration
const CARDS = [
  { id:'total-balance',  key:'balance',      label:'Total Balance',  Icon:DollarSign,  color:'text-primary',  bg:'bg-primary/10',   stagger:'stagger-1' },
  { id:'total-income',   key:'totalIncome',  label:'Total Income',   Icon:TrendingUp,  color:'text-income',   bg:'bg-income/10',    stagger:'stagger-2' },
  { id:'total-expenses', key:'totalExpense', label:'Total Expenses', Icon:TrendingDown,color:'text-expense',  bg:'bg-expense/10',   stagger:'stagger-3' },
  { id:'savings-rate',   key:'savingsRate',  label:'Savings Rate',   Icon:PiggyBank,   color:'text-warning',  bg:'bg-warning/10',   stagger:'stagger-4', isPercent: true },
];

export default function DashboardPage() {
  // Selecting data from the store
  const summary = useSelector(selectSummary);
  const status  = useSelector(selectTransactionStatus);
  const role    = useSelector(selectRole);
  const loading = status === 'loading';
  const isAdmin = role === 'admin';

  return (
    <div className="flex flex-col gap-6 py-6">
      
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-dark-border shadow-sm animate-fade-slide-up">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, {isAdmin ? 'Admin' : 'User'}
            {isAdmin ? (
              <Shield className="w-5 h-5 text-primary" />
            ) : (
              <Eye className="w-5 h-5 text-slate-400" />
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin ? "Here's the overall system activity and summary." : "Here's an overview of the financial activity."}
          </p>
        </div>
        
        {isAdmin && (
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        )}
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {CARDS.map(({ id, key, label, Icon, color, bg, stagger, isPercent }) => (
          <Card key={id} id={id} hover className={`animate-fade-slide-up ${stagger} relative overflow-hidden flex flex-col justify-between`}>
            {loading ? <SkeletonCard lines={2} /> : (
              <>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 leading-none sm:leading-tight">{label}</span>
                </div>
                <p className={`text-base sm:text-xl lg:text-3xl font-bold leading-none mb-1 sm:mb-3 truncate ${color}`}>
                  {isPercent ? formatPercent(summary[key]) : formatCurrency(summary[key])}
                </p>
                <p className="text-[9px] sm:text-xs text-slate-400 truncate">
                  {key === 'savingsRate'
                    ? (summary[key] >= 20 ? '🎉 Great savings!' : summary[key] >= 0 ? 'Keep saving' : 'Overspending')
                    : 'All transactions'}
                </p>
              </>
            )}
          </Card>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Balance Trend — takes 2 cols */}
        <Card padding={false} className="lg:col-span-2 animate-fade-slide-up stagger-1 overflow-hidden">
          <div className="px-5 pt-5 pb-0">
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
              <CardSubtitle>Cumulative balance over time</CardSubtitle>
            </CardHeader>
          </div>
          <div className="px-4 pb-5">
            {loading ? <SkeletonCard lines={5} /> : <BalanceTrendChart />}
          </div>
        </Card>

        {/* Spending Pie */}
        <Card padding={false} className="animate-fade-slide-up stagger-2 overflow-hidden">
          <div className="px-5 pt-5 pb-0">
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardSubtitle>Expenses by category</CardSubtitle>
            </CardHeader>
          </div>
          <div className="px-4 pb-5">
            {loading ? <SkeletonCard lines={5} /> : <SpendingPieChart />}
          </div>
        </Card>

        {/* Monthly Bar — full width */}
        <Card padding={false} className="lg:col-span-3 animate-fade-slide-up stagger-3 overflow-hidden">
          <div className="px-5 pt-5 pb-0">
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardSubtitle>Income vs Expenses per month</CardSubtitle>
            </CardHeader>
          </div>
          <div className="px-4 pb-5">
            {loading ? <SkeletonCard lines={5} /> : <MonthlyBarChart limit={5} />}
          </div>
        </Card>
      </section>
    </div>
  );
}
