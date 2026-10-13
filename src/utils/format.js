export const formatPrice = (value) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "USD" }).format(Number(value));

export const formatDate = (iso) => new Date(iso).toLocaleString("uk-UA");