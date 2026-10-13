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
    <FormCard title="Sign up" error={error} onSubmit={handleSubmit(onSubmit)}>
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
        name="password"
        type="password"
        label="Password (at least 6 characters)"
        rules={{
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        }}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>Create account</Button>
    </FormCard>
  );
}