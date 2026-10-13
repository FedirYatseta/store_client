export const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));

export const formatDate = (iso) => new Date(iso).toLocaleString("en-US");