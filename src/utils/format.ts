export function formatCurrency(n: number) {
  return `£${n.toFixed(2)}`;
}

export function generateOrderId() {
  const t = Date.now().toString(36).toUpperCase();
  return `NGT-${t.slice(-6)}`;
}
