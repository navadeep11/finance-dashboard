import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTransactions } from './app/transactions/transactionsSlice';
import { selectTheme } from './app/auth/roleSlice';
import Layout from './components/layout/Layout';
import DashboardPage    from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage     from './pages/InsightsPage';

export default function App() {
  const dispatch = useDispatch();
  const theme    = useSelector(selectTheme);

  // Tailwind dark mode: toggle 'dark' class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    dispatch(initializeTransactions());
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/insights"     element={<InsightsPage />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
