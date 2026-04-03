import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactions/transactionsSlice';
import roleReducer from './auth/roleSlice';

// ─── localStorage persistence middleware ─────────────────────────────────────
const localStorageMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  const state = storeAPI.getState();

  try {
    // Persist transactions only if they have been successfully loaded
    // This prevents overwriting the saved data with the empty initial state on page load
    if (state.transactions.status === 'succeeded') {
      localStorage.setItem(
        'finance_transactions',
        JSON.stringify(state.transactions.items)
      );
    }
    // Persist role
    localStorage.setItem('finance_role', state.role.current);
    // Persist theme
    localStorage.setItem('finance_theme', state.role.theme);
  } catch (_) {}

  return result;
};

const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    role: roleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
