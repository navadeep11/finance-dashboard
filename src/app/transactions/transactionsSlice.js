import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockData from '../../assets/mock-data.json';
import { generateId } from '../../utils/formatters';

const STORAGE_KEY = 'finance_transactions';

// Load from localStorage or fallback to mock data
const loadTransactions = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return the stored transactions (even if empty, meaning the user deleted all)
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return mockData.transactions;
};

// Simulated async init (mock API)
export const initializeTransactions = createAsyncThunk(
  'transactions/initialize',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return loadTransactions();
  }
);


//-------------- Initial state ----------------

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded'
  filters: {
    search: '',
    type: 'all',      // 'all' | 'income' | 'expense'
    categories: [],   // [] means all
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
  },
  sort: {
    field: 'date',    // 'date' | 'amount' | 'description' | 'category'
    direction: 'desc', // 'asc' | 'desc'
  },
  pagination: {
    page: 1,
    perPage: 10,
  },
  groupBy: 'none',   // 'none' | 'day' | 'week' | 'month'
};


//-------------- Transactions slice ----------------

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const newTx = { ...action.payload, id: generateId() };
      state.items.unshift(newTx);
      state.pagination.page = 1;
    },
    updateTransaction: (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setTypeFilter: (state, action) => {
      state.filters.type = action.payload;
      state.pagination.page = 1;
    },
    setCategoryFilter: (state, action) => {
      state.filters.categories = action.payload;
      state.pagination.page = 1;
    },
    setDateFrom: (state, action) => {
      state.filters.dateFrom = action.payload;
      state.pagination.page = 1;
    },
    setDateTo: (state, action) => {
      state.filters.dateTo = action.payload;
      state.pagination.page = 1;
    },
    setAmountMin: (state, action) => {
      state.filters.amountMin = action.payload;
      state.pagination.page = 1;
    },
    setAmountMax: (state, action) => {
      state.filters.amountMax = action.payload;
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setSort: (state, action) => {
      const { field, direction } = action.payload;
      state.sort.field = field;
      state.sort.direction = direction;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setGroupBy: (state, action) => {
      state.groupBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      });
  },
});

//-------------- Actions ----------------

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setSearch,
  setTypeFilter,
  setCategoryFilter,
  setDateFrom,
  setDateTo,
  setAmountMin,
  setAmountMax,
  clearFilters,
  setSort,
  setPage,
  setGroupBy,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

