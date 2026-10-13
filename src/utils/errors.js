// Дістає читабельне повідомлення з помилки RTK Query (формат відповідей Rails)
export function getErrorMessage(error) {
  const data = error?.data;
  if (data?.errors) return data.errors.join(", ");
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  return "Сталася помилка. Спробуйте ще раз.";
}