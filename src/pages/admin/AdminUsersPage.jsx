import {
  Alert, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  useDeleteAdminUserMutation, useGetAdminUsersQuery, useUpdateAdminUserMutation,
} from "../../api/adminApi";
import FormCard from "../../components/FormCard";
import FormTextField from "../../components/FormTextField";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { getErrorMessage } from "../../utils/errors";

export default function AdminUsersPage() {
  const currentUser = useSelector(selectCurrentUser);
  const { data: users = [], error: loadError } = useGetAdminUsersQuery();
  const [updateUser] = useUpdateAdminUserMutation();
  const [deleteUser] = useDeleteAdminUserMutation();

  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { first_name: "", last_name: "", email: "", role: "user" },
  });

  const onSave = async ({ first_name, last_name, email, role }) => {
    setError("");
    try {
      await updateUser({ id: editing.id, first_name, last_name, email, role }).unwrap();
      setEditing(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Видалити користувача разом із його замовленнями?")) return;
    setError("");
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Користувачі</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(loadError)}</Alert>}
      {!editing && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {editing && (
        <FormCard title={`Редагування #${editing.id}`} error={error} onSubmit={handleSubmit(onSave)}>
          <FormTextField
            control={control}
            name="first_name"
            label="Ім'я"
            rules={{ required: "Введіть ім'я" }}
          />
          <FormTextField
            control={control}
            name="last_name"
            label="Прізвище"
            rules={{ required: "Введіть прізвище" }}
          />
          <FormTextField
            control={control}
            name="email"
            type="email"
            label="Email"
            rules={{ required: "Введіть email" }}
          />
          <FormTextField
            control={control}
            name="role"
            label="Роль"
            select
            rules={{ required: "Оберіть роль" }}
          >
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </FormTextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained">Зберегти</Button>
            <Button onClick={() => setEditing(null)}>Скасувати</Button>
          </Stack>
        </FormCard>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ім'я</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.first_name} {u.last_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(u);
                        setError("");
                        reset({
                          first_name: u.first_name,
                          last_name: u.last_name,
                          email: u.email,
                          role: u.role,
                        });
                      }}
                    >
                      Редагувати
                    </Button>
                    {u.id !== currentUser.id && (
                      <Button size="small" color="error" onClick={() => handleDelete(u.id)}>Видалити</Button>
                    )}
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