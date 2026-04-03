import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import {
  setSearch, setTypeFilter, setCategoryFilter, setDateFrom, setDateTo,
  setAmountMin, setAmountMax, clearFilters, setSort, setGroupBy,
} from '../../app/transactions/transactionsSlice';
import {
  selectFiltersState, selectSortState, selectUniqueCategories, selectGroupBy,
} from '../../app/transactions/transactionsSelectors';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';


// transaction filters
export default function TransactionFilters() {
  // dispatch
  const dispatch   = useDispatch();

  // selectors
  const filters    = useSelector(selectFiltersState);
  const sort       = useSelector(selectSortState);
  const categories = useSelector(selectUniqueCategories);
  const groupBy    = useSelector(selectGroupBy);

  // state
  const [showAdvanced, setShowAdvanced] = useState(false);

  // has active filters
  const hasActive = filters.search || filters.type !== 'all' || filters.categories.length > 0
    || filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax;

  // handle sort
  const handleSort = (field) => {
    dispatch(setSort({ field, direction: sort.field === field && sort.direction === 'asc' ? 'desc' : sort.field === field ? 'asc' : 'desc' }));
  };

  // date input class
  const dateInputCls = `h-9 px-3 rounded-lg border text-sm bg-slate-100 dark:bg-dark-input
    text-slate-900 dark:text-slate-100 border-slate-200 dark:border-dark-border
    focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all w-full`;

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1 */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input id="tx-search" placeholder="Search transactions..."
          value={filters.search} onChange={(e) => dispatch(setSearch(e.target.value))}
          leftIcon={<Search size={15} />}
          rightIcon={filters.search
            ? <button onClick={() => dispatch(setSearch(''))} className="text-slate-400 hover:text-expense flex items-center" aria-label="Clear"><X size={13} /></button>
            : null}
          className="flex-1 min-w-[200px]"
        />

        {/* Type tabs */}
        <div className="flex gap-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl p-1 flex-shrink-0">
          {[['all','All'],['income','Income'],['expense','Expense']].map(([val, label]) => (
            <button key={val} id={`filter-type-${val}`}
              onClick={() => dispatch(setTypeFilter(val))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                ${filters.type === val
                  ? val === 'income' ? 'bg-income text-white' : val === 'expense' ? 'bg-expense text-white' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >{label}</button>
          ))}
        </div>

        <Button variant={showAdvanced ? 'primary' : 'secondary'} size="md"
          leftIcon={<SlidersHorizontal size={15} />}
          onClick={() => setShowAdvanced((p) => !p)} id="advanced-filters-btn"
        >
          Filters
          {hasActive && <span className="w-2 h-2 bg-warning rounded-full ml-1" />}
        </Button>

        {hasActive && (
          <Button variant="ghost" size="md" leftIcon={<X size={14} />} onClick={() => dispatch(clearFilters())} id="clear-filters-btn">
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-border rounded-2xl p-5 flex flex-col gap-5 animate-fade-slide-down">

          {/* Categories */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const sel = filters.categories.includes(cat);
                return (
                  <button key={cat}
                    onClick={() => dispatch(setCategoryFilter(sel ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat]))}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150
                      ${sel ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary'}`}
                  >{cat}</button>
                );
              })}
            </div>
          </div>

          {/* Date + Amount range */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['Date From', 'date', filters.dateFrom, (v) => dispatch(setDateFrom(v))],
              ['Date To',   'date', filters.dateTo,   (v) => dispatch(setDateTo(v))],
              ['Min Amount ($)', 'number', filters.amountMin, (v) => dispatch(setAmountMin(v))],
              ['Max Amount ($)', 'number', filters.amountMax, (v) => dispatch(setAmountMax(v))],
            ].map(([label, type, value, onChange]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
                <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                  placeholder={type === 'number' ? '0' : ''} className={dateInputCls} />
              </div>
            ))}
          </div>

          {/* Sort + Group */}
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort By</p>
              <div className="flex flex-wrap gap-1.5">
                {['date','amount','description','category'].map((f) => (
                  <button key={f} onClick={() => handleSort(f)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                      ${sort.field === f ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary'}`}
                  >
                    {f.charAt(0).toUpperCase()+f.slice(1)}
                    {sort.field === f && (sort.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Group By</p>
              <div className="flex flex-wrap gap-1.5">
                {[['none','None'],['day','Day'],['week','Week'],['month','Month']].map(([val, label]) => (
                  <button key={val} onClick={() => dispatch(setGroupBy(val))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
                      ${groupBy === val ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary'}`}
                  >{label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
