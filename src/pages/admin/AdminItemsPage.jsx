import {
  Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateAdminItemMutation, useDeleteAdminItemMutation, useGetAdminItemsQuery,
  useUpdateAdminItemMutation,
} from "../../api/adminApi";
import FormCard from "../../components/FormCard";
import FormTextField from "../../components/FormTextField";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";

const EMPTY_FORM = { name: "", description: "", price: "" };

export default function AdminItemsPage() {
  const { data: items = [], error: loadError } = useGetAdminItemsQuery();
  const [createItem] = useCreateAdminItemMutation();
  const [updateItem] = useUpdateAdminItemMutation();
  const [deleteItem] = useDeleteAdminItemMutation();

  const { control, handleSubmit, reset } = useForm({ defaultValues: EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    reset(EMPTY_FORM);
    setEditingId(null);
  };

  const onSubmit = async (form) => {
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
    reset({ name: item.name, description: item.description || "", price: item.price });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    setError("");
    try {
      await deleteItem(id).unwrap();
    } catch (err) {
      setError(getErrorMessage(err)); // For example, the item may already be in an order.
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Items</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(loadError)}</Alert>}

      <FormCard
        title={editingId ? `Edit item #${editingId}` : "New item"}
        error={error}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormTextField
          control={control}
          name="name"
          label="Name"
          rules={{ required: "Item name is required" }}
        />
        <FormTextField
          control={control}
          name="description"
          label="Description"
          multiline
          minRows={2}
        />
        <FormTextField
          control={control}
          name="price"
          type="number"
          label="Price"
          slotProps={{ htmlInput: { step: "0.01", min: 0 } }}
          rules={{
            required: "Price is required",
            min: { value: 0, message: "Price cannot be negative" },
          }}
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained">{editingId ? "Save" : "Create"}</Button>
          {editingId && <Button onClick={resetForm}>Cancel</Button>}
        </Stack>
      </FormCard>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
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
                    <Button size="small" onClick={() => handleEdit(item)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
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