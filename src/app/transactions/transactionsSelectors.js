import { createSelector } from '@reduxjs/toolkit';

//-------------- Selectors ----------------

const selectAllTransactions = (state) => state.transactions.items;
const selectFilters = (state) => state.transactions.filters;
const selectSort = (state) => state.transactions.sort;
const selectPagination = (state) => state.transactions.pagination;

// Selectors
export const selectFilteredTransactions = createSelector(
  [selectAllTransactions, selectFilters, selectSort],
  (items, filters, sort) => {
    let result = [...items];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.categories.length > 0) {
      result = result.filter((t) => filters.categories.includes(t.category));
    }
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }
    if (filters.amountMin !== '') {
      result = result.filter((t) => t.amount >= parseFloat(filters.amountMin));
    }
    if (filters.amountMax !== '') {
      result = result.filter((t) => t.amount <= parseFloat(filters.amountMax));
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sort.field === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else if (sort.field === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sort.field === 'description') {
        comparison = a.description.localeCompare(b.description);
      } else if (sort.field === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }
);

// select paginated transactions
export const selectPaginatedTransactions = createSelector(
  [selectFilteredTransactions, selectPagination],
  (filtered, pagination) => {
    const start = (pagination.page - 1) * pagination.perPage;
    return filtered.slice(start, start + pagination.perPage);
  }
);

// select total pages
export const selectTotalPages = createSelector(
  [selectFilteredTransactions, selectPagination],
  (filtered, pagination) => Math.max(1, Math.ceil(filtered.length / pagination.perPage))
);

// select summary
export const selectSummary = createSelector([selectAllTransactions], (items) => {
  const totalIncome = items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;
  return { totalIncome, totalExpense, balance, savingsRate };
});


// select category breakdown
export const selectCategoryBreakdown = createSelector([selectAllTransactions], (items) => {
  const expenses = items.filter((t) => t.type === 'expense');
  const map = {};
  expenses.forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
});

// select monthly data
export const selectMonthlyData = createSelector([selectAllTransactions], (items) => {
  const map = {};
  items.forEach((t) => {
    const key = t.date.slice(0, 7);
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
    if (t.type === 'income') map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
});


// select balance trend
export const selectBalanceTrend = createSelector([selectAllTransactions], (items) => {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  let balance = 0;
  const seen = new Set();
  const result = [];
  sorted.forEach((t) => {
    balance += t.type === 'income' ? t.amount : -t.amount;
    const key = t.date;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ date: key, balance: parseFloat(balance.toFixed(2)) });
    } else {
      result[result.length - 1].balance = parseFloat(balance.toFixed(2));
    }
  });
  return result;
});

// select insights
export const selectInsights = createSelector(
  [selectAllTransactions, selectCategoryBreakdown, selectMonthlyData],
  (items, categoryBreakdown, monthlyData) => {
    const highestCategory = categoryBreakdown[0] || null;
    const months = monthlyData.slice(-2);
    const currentMonth = months[months.length - 1] || null;
    const prevMonth = months.length >= 2 ? months[months.length - 2] : null;

    const top5 = [...items]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const avgDailySpend = (() => {
      const expenses = items.filter((t) => t.type === 'expense');
      if (expenses.length === 0) return 0;
      const total = expenses.reduce((s, t) => s + t.amount, 0);
      const dates = expenses.map((t) => t.date);
      const minDate = new Date(Math.min(...dates.map((d) => new Date(d))));
      const maxDate = new Date(Math.max(...dates.map((d) => new Date(d))));
      const days = Math.max(1, (maxDate - minDate) / (1000 * 60 * 60 * 24));
      return total / days;
    })();

    return { highestCategory, currentMonth, prevMonth, top5, avgDailySpend };
  }
);


// select unique categories
export const selectUniqueCategories = createSelector([selectAllTransactions], (items) => {
  return [...new Set(items.map((t) => t.category))].sort();
});

// select transaction status
export const selectTransactionStatus = (state) => state.transactions.status;
export const selectFiltersState = (state) => state.transactions.filters;
export const selectSortState = (state) => state.transactions.sort;
export const selectPaginationState = (state) => state.transactions.pagination;
export const selectGroupBy = (state) => state.transactions.groupBy;
