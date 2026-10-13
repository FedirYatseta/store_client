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
    if (!confirm("Delete this user and their orders?")) return;
    setError("");
    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Users</Typography>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(loadError)}</Alert>}
      {!editing && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {editing && (
        <FormCard title={`Edit user #${editing.id}`} error={error} onSubmit={handleSubmit(onSave)}>
          <FormTextField
            control={control}
            name="first_name"
            label="First name"
            rules={{ required: "First name is required" }}
          />
          <FormTextField
            control={control}
            name="last_name"
            label="Last name"
            rules={{ required: "Last name is required" }}
          />
          <FormTextField
            control={control}
            name="email"
            type="email"
            label="Email"
            rules={{ required: "Email is required" }}
          />
          <FormTextField
            control={control}
            name="role"
            label="Role"
            select
            rules={{ required: "Select a role" }}
          >
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </FormTextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained">Save</Button>
            <Button onClick={() => setEditing(null)}>Cancel</Button>
          </Stack>
        </FormCard>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
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
                      Edit
                    </Button>
                    {u.id !== currentUser.id && (
                      <Button size="small" color="error" onClick={() => handleDelete(u.id)}>Delete</Button>
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