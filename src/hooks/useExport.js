import { useSelector } from 'react-redux';
import { selectFilteredTransactions } from '../app/transactions/transactionsSelectors';

// Custom hook to export transactions

export function useExport() {
  // Selecting filtered transactions from the store
  const transactions = useSelector(selectFilteredTransactions);

  // Export transactions to CSV
  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map((t) => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csv, 'transactions.csv', 'text/csv;charset=utf-8;');
  };

  // Export transactions to JSON
  const exportJSON = () => {
    const json = JSON.stringify(transactions, null, 2);
    downloadFile(json, 'transactions.json', 'application/json');
  };

  // Returning the export functions and the count of transactions
  return { exportCSV, exportJSON, count: transactions.length };
}

// Helper function to download the file
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
