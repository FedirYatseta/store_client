import {
  Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography,
} from "@mui/material";
import { useState } from "react";
import {
  useCreateAdminItemMutation, useDeleteAdminItemMutation, useGetAdminItemsQuery,
  useUpdateAdminItemMutation,
} from "../../api/adminApi";
import FormCard from "../../components/FormCard";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";

const EMPTY_FORM = { name: "", description: "", price: "" };

export default function AdminItemsPage() {
  const { data: items = [], error: loadError } = useGetAdminItemsQuery();
  const [createItem] = useCreateAdminItemMutation();
  const [updateItem] = useUpdateAdminItemMutation();
  const [deleteItem] = useDeleteAdminItemMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) await updateItem({ id: editingId, ...form }).unwrap();
      else await createItem(form).unwrap();
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description || "", price: item.price });
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити товар?")) return;
    setError("");
    try {
      await deleteItem(id).unwrap();
    } catch (err) {
      setError(getErrorMessage(err)); // напр. товар вже є в замовленнях
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Товари</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(loadError)}</Alert>}

      <FormCard
        title={editingId ? `Редагування #${editingId}` : "Новий товар"}
        error={error}
        onSubmit={handleSubmit}
      >
        <TextField name="name" label="Назва" value={form.name} onChange={handleChange} required />
        <TextField name="description" label="Опис" value={form.description} onChange={handleChange} multiline minRows={2} />
        <TextField
          name="price" type="number" label="Ціна" value={form.price} onChange={handleChange}
          slotProps={{ htmlInput: { step: "0.01", min: 0 } }} required
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained">{editingId ? "Зберегти" : "Створити"}</Button>
          {editingId && <Button onClick={resetForm}>Скасувати</Button>}
        </Stack>
      </FormCard>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell>Опис</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleEdit(item)}>Редагувати</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Видалити</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}