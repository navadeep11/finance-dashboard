import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { deleteTransaction, setPage } from '../../app/transactions/transactionsSlice';
import {
  selectPaginatedTransactions, selectFilteredTransactions, selectTotalPages,
  selectPaginationState, selectGroupBy,
} from '../../app/transactions/transactionsSelectors';
import { selectIsAdmin } from '../../app/auth/roleSlice';
import { formatCurrency, formatShortDate, formatDate, getMonthKey, getMonthLabel } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import TransactionForm from './TransactionForm';


// dot colors
const DOT_COLORS = {
  'Food & Dining':'#3b82f6','Housing':'#8b5cf6','Transportation':'#f59e0b',
  'Entertainment':'#ec4899','Healthcare':'#10b981','Shopping':'#f97316',
  'Utilities':'#06b6d4','Salary':'#22c55e','Freelance':'#6366f1',
  'Investment Returns':'#eab308','Other':'#94a3b8',
};


export default function TransactionList() {
  // dispatch
  const dispatch   = useDispatch();

  // selectors
  const isAdmin    = useSelector(selectIsAdmin);
  const rows       = useSelector(selectPaginatedTransactions);
  const filtered   = useSelector(selectFilteredTransactions);
  const totalPages = useSelector(selectTotalPages);
  const pagination = useSelector(selectPaginationState);
  const groupBy    = useSelector(selectGroupBy);
  const [editTx, setEditTx]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // get group label
  const getGroupLabel = (tx) => {
    if (groupBy === 'month') return getMonthLabel(getMonthKey(tx.date));
    if (groupBy === 'day')   return formatDate(tx.date);
    if (groupBy === 'week')  {
      const d  = new Date(tx.date + 'T00:00:00');
      return `Week ${Math.ceil(d.getDate() / 7)} — ${getMonthLabel(getMonthKey(tx.date))}`;
    }
    return null;
  };

  // group by date
  const grouped = (() => {
    if (groupBy === 'none' || !groupBy) return [{ key: null, rows }];
    const map = {};
    rows.forEach((tx) => {
      const key = getGroupLabel(tx);
      if (!map[key]) map[key] = { key, rows: [] };
      map[key].rows.push(tx);
    });
    return Object.values(map);
  })();

  // empty state
  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<ArrowDownLeft size={28} />}
        title="No transactions found"
        description="Try adjusting your search or filters."
      />
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden bg-white dark:bg-dark-card">
        {/* Table header — hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1fr_1.4fr_auto] px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-dark-border text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
          {isAdmin && <span>Actions</span>}
        </div>

        {grouped.map(({ key, rows: groupRows }) => (
          <div key={key || 'all'}>
            {key && (
              <div className="flex items-center justify-between px-5 py-2 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-dark-border text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>{key}</span>
                <span className="font-normal">{groupRows.length} transactions</span>
              </div>
            )}
            {groupRows.map((tx) => (
              <div key={tx.id}
                className={`grid ${isAdmin ? 'grid-cols-[1fr_auto_auto]' : 'grid-cols-[1fr_auto]'} md:grid-cols-[2fr_1.5fr_1fr_1.4fr_auto] items-center gap-2 sm:gap-3 px-4 sm:px-5 py-4
                  border-b border-slate-100 dark:border-dark-border last:border-b-0
                  hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150 animate-fade-slide-up`}
              >
                {/* Description */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 md:col-span-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${tx.type === 'income' ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}>
                    {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{tx.description}</span>
                </div>

                {/* Category — hidden on mobile */}
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DOT_COLORS[tx.category] || '#94a3b8' }} />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{tx.category}</span>
                </div>

                {/* Date — hidden on mobile */}
                <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">{formatShortDate(tx.date)}</div>

                {/* Amount */}
                <div className="flex items-center justify-end">
                  <span className={`text-sm font-semibold tabular-nums ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon"
                      onClick={() => setEditTx(tx)} aria-label={`Edit ${tx.description}`}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="icon"
                      onClick={() => setDeleteId(tx.id)} aria-label={`Delete ${tx.description}`}
                      className="text-expense/70 hover:text-expense hover:bg-expense/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
          <span className="text-sm text-slate-400">
            Showing {(pagination.page-1)*pagination.perPage+1}–{Math.min(pagination.page*pagination.perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<ChevronLeft size={14}/>}
              onClick={() => dispatch(setPage(pagination.page-1))} disabled={pagination.page===1}>Prev</Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages,5) }, (_, i) => {
                const page = totalPages<=5 ? i+1 : pagination.page<=3 ? i+1 : pagination.page>=totalPages-2 ? totalPages-4+i : pagination.page-2+i;
                return (
                  <button key={page} onClick={() => dispatch(setPage(page))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium border transition-all
                      ${pagination.page===page ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>
                    {page}
                  </button>
                );
              })}
            </div>
            <Button variant="secondary" size="sm" rightIcon={<ChevronRight size={14}/>}
              onClick={() => dispatch(setPage(pagination.page+1))} disabled={pagination.page===totalPages}>Next</Button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      <TransactionForm isOpen={!!editTx} onClose={() => setEditTx(null)} editTransaction={editTx} />

      {/* Delete confirm */}
      {deleteId && createPortal(
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setDeleteId(null)}>
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-3 animate-scale-in"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-expense/10 flex items-center justify-center text-expense mb-1">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Delete Transaction?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
            <div className="flex gap-3 mt-2 w-full justify-center">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => { dispatch(deleteTransaction(deleteId)); setDeleteId(null); }}>Delete</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
