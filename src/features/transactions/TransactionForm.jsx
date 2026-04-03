import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction, updateTransaction } from '../../app/transactions/transactionsSlice';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { generateId } from '../../utils/formatters';

// categories
const CATEGORIES = [
  'Food & Dining','Housing','Transportation','Entertainment',
  'Healthcare','Shopping','Utilities','Salary','Freelance',
  'Investment Returns','Other',
];

// empty transaction
const EMPTY = { date: new Date().toISOString().slice(0,10), description: '', category: 'Food & Dining', type: 'expense', amount: '' };


// transaction form
export default function TransactionForm({ isOpen, onClose, editTransaction = null }) {

  // dispatch
  const dispatch = useDispatch();
  const [form, setForm]     = useState(editTransaction || EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!editTransaction;

  // Reset form when opened or edit transaction changes
  useEffect(() => {
    if (isOpen) {
      setForm(editTransaction || EMPTY);
      setErrors({});
    }
  }, [isOpen, editTransaction]);

  // set form
  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  // validate
  const validate = () => {
    const errs = {};
    if (!form.date)        errs.date = 'Required';
    if (!form.description) errs.description = 'Required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    return errs;
  };

  // handle submit
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const payload = { ...form, amount: parseFloat(Number(form.amount).toFixed(2)), id: editTransaction?.id || generateId() };
    isEdit ? dispatch(updateTransaction(payload)) : dispatch(addTransaction(payload));
    setLoading(false);
    onClose();
    if (!isEdit) setForm(EMPTY);
  };

  // handle close
  const handleClose = () => { setErrors({}); setForm(editTransaction || EMPTY); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
      footer={<>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>{isEdit ? 'Save Changes' : 'Add Transaction'}</Button>
      </>}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {/* Type toggle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Transaction Type</span>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
            {['expense','income'].map((t) => (
              <button
                key={t} type="button"
                id={`type-btn-${t}`}
                onClick={() => setForm((p) => ({ ...p, type: t }))}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${form.type === t
                    ? t === 'expense'
                      ? 'bg-expense text-white shadow-expense'
                      : 'bg-income text-white shadow-income'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <Input label="Amount ($)" id="tx-amount" type="number" step="0.01" min="0"
            placeholder="0.00" value={form.amount} onChange={set('amount')} error={errors.amount} />
          <Input label="Date" id="tx-date" type="date" value={form.date} onChange={set('date')} error={errors.date} />
        </div>

        <Input label="Description" id="tx-description"
          placeholder="e.g. Netflix subscription, Monthly rent..."
          value={form.description} onChange={set('description')} error={errors.description} />

        <Select label="Category" id="tx-category" value={form.category}
          options={CATEGORIES} placeholder={null} onChange={set('category')} />
      </form>
    </Modal>
  );
}
