import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import FormCard from "../components/FormCard";
import { setCredentials } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const credentials = await login(form).unwrap();
      dispatch(setCredentials(credentials));
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Вхід" error={error} onSubmit={handleSubmit}>
      <TextField name="email" type="email" label="Email" value={form.email} onChange={handleChange} required />
      <TextField name="password" type="password" label="Пароль" value={form.password} onChange={handleChange} required />
      <Button type="submit" variant="contained" disabled={isLoading}>Увійти</Button>
    </FormCard>
  );
}