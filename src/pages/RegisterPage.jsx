import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../api/authApi";
import { ROUTES } from "../app/routes";
import FormCard from "../components/FormCard";
import { getErrorMessage } from "../utils/errors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form).unwrap();
      navigate(ROUTES.login); // токен видається лише після входу
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Реєстрація" error={error} onSubmit={handleSubmit}>
      <TextField name="first_name" label="Ім'я" value={form.first_name} onChange={handleChange} required />
      <TextField name="last_name" label="Прізвище" value={form.last_name} onChange={handleChange} required />
      <TextField name="email" type="email" label="Email" value={form.email} onChange={handleChange} required />
      <TextField name="password" type="password" label="Пароль (мін. 6 символів)" value={form.password} onChange={handleChange} required />
      <Button type="submit" variant="contained" disabled={isLoading}>Зареєструватися</Button>
    </FormCard>
  );
}