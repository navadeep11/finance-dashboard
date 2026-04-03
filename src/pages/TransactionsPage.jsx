import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Download, FileJson } from 'lucide-react';
import { selectIsAdmin } from '../app/auth/roleSlice';
import { selectFilteredTransactions } from '../app/transactions/transactionsSelectors';
import TransactionFilters from '../features/transactions/TransactionFilters';
import TransactionList    from '../features/transactions/TransactionList';
import TransactionForm    from '../features/transactions/TransactionForm';
import Card   from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge  from '../components/ui/Badge';
import { useExport } from '../hooks/useExport';

export default function TransactionsPage() {
  // selectors
  const isAdmin  = useSelector(selectIsAdmin);
  const filtered = useSelector(selectFilteredTransactions);

  // hooks
  const { exportCSV, exportJSON } = useExport();

  // state
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5 py-6 animate-fade-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Badge variant="primary">{filtered.length} transactions</Badge>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" size="md" leftIcon={<Download size={15}/>} onClick={exportCSV} id="export-csv-btn">CSV</Button>
          <Button variant="secondary" size="md" leftIcon={<FileJson size={15}/>} onClick={exportJSON} id="export-json-btn">JSON</Button>
          {isAdmin && (
            <Button variant="primary" size="md" leftIcon={<Plus size={16}/>} onClick={() => setAddOpen(true)} id="add-transaction-btn">
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Viewer notice */}
      {!isAdmin && (
        <div className="flex items-center gap-2 px-4 py-3 bg-info/10 border border-info/30 rounded-xl text-sm text-info">
          👁️ Viewing as <strong>Viewer</strong> — switch to Admin in the top bar to add or edit transactions.
        </div>
      )}

      {/* Filters */}
      <Card><TransactionFilters /></Card>

      {/* List */}
      <TransactionList />

      <TransactionForm isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
