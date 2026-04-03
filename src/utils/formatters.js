
// Formatting currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Formatting date
export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Formatting short date
export const formatShortDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Formatting month and year
export const formatMonthYear = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Formatting percentage
export const formatPercent = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Getting month key
export const getMonthKey = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};


// Getting month label
export const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
};


// Generating ID
export const generateId = () => {
  return 't' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
