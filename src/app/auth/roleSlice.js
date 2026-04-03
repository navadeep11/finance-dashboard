import { createSlice } from '@reduxjs/toolkit';

const ROLE_KEY = 'finance_role';
const THEME_KEY = 'finance_theme';

// Loading role from localStorage

const loadRole = () => {
  try {
    return localStorage.getItem(ROLE_KEY) || 'viewer';
  } catch (_) {
    return 'viewer';
  }
};

// Loading theme from localStorage

const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch (_) {
    return 'light';
  }
};

// Creating role slice

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    current: loadRole(),   // 'admin' | 'viewer'
    theme: loadTheme(),    // 'light' | 'dark'
  },
  reducers: {
    setRole: (state, action) => {
      state.current = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

// Exporting actions

export const { setRole, toggleTheme, setTheme } = roleSlice.actions;
export const selectRole = (state) => state.role.current;
export const selectIsAdmin = (state) => state.role.current === 'admin';
export const selectTheme = (state) => state.role.theme;

export default roleSlice.reducer;
