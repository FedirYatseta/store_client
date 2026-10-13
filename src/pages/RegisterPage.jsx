import { Button } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../api/authApi";
import { ROUTES } from "../app/routes";
import FormCard from "../components/FormCard";
import FormTextField from "../components/FormTextField";
import { getErrorMessage } from "../utils/errors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const { control, handleSubmit } = useForm({
    defaultValues: { first_name: "", last_name: "", email: "", password: "" },
  });
  const [error, setError] = useState("");

  const onSubmit = async (form) => {
    setError("");
    try {
      await signup(form).unwrap();
      navigate(ROUTES.login); 
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Реєстрація" error={error} onSubmit={handleSubmit(onSubmit)}>
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
        name="password"
        type="password"
        label="Пароль (мін. 6 символів)"
        rules={{
          required: "Введіть пароль",
          minLength: { value: 6, message: "Пароль має містити щонайменше 6 символів" },
        }}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>Зареєструватися</Button>
    </FormCard>
  );
}