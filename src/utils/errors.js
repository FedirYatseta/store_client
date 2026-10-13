// Extracts a readable message from an RTK Query error (Rails response format).
export function getErrorMessage(error) {
  const data = error?.data;
  if (data?.errors) return data.errors.join(", ");
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  return "Сталася помилка. Спробуйте ще раз.";
}