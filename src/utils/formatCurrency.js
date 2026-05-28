/**
 * Formats a number as Indian Rupee (INR) currency.
 * Example: 5000000 -> ₹50,00,000
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number with standard commas but no symbol.
 * Example: 5000000 -> 50,00,000
 */
export const formatNumber = (val) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(val);
};
