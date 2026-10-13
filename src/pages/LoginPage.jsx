import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../api/authApi";
import { ROUTES } from "../app/routes";
import FormCard from "../components/FormCard";
import FormTextField from "../components/FormTextField";
import { setCredentials } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { control, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const [error, setError] = useState("");

  const onSubmit = async (form) => {
    setError("");
    try {
      const credentials = await login(form).unwrap();
      dispatch(setCredentials(credentials));
      navigate(ROUTES.catalog);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Вхід" error={error} onSubmit={handleSubmit(onSubmit)}>
      <FormTextField
        control={control}
        name="email"
        type="email"
        label="Email"
        rules={{ required: "Введіть email" }}
      />
      <FormTextField
        control={control}
        name="password"
        type="password"
        label="Пароль"
        rules={{ required: "Введіть пароль" }}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>Увійти</Button>
    </FormCard>
  );
}