import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../api/authApi";
import FormCard from "../components/FormCard";
import { selectCurrentUser, setUser } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    // Порожній пароль не відправляємо, щоб не перезаписати існуючий
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      const updated = await updateProfile(payload).unwrap();
      dispatch(setUser(updated));
      setForm({ ...form, password: "" });
      setSuccess("Збережено");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Мій профіль" error={error} success={success} onSubmit={handleSubmit}>
      <TextField name="first_name" label="Ім'я" value={form.first_name} onChange={handleChange} required />
      <TextField name="last_name" label="Прізвище" value={form.last_name} onChange={handleChange} required />
      <TextField name="email" type="email" label="Email" value={form.email} onChange={handleChange} required />
      <TextField name="password" type="password" label="Новий пароль (необов'язково)" value={form.password} onChange={handleChange} />
      <Button type="submit" variant="contained" disabled={isLoading}>Зберегти</Button>
    </FormCard>
  );
}