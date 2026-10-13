import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "../api/authApi";
import FormCard from "../components/FormCard";
import FormTextField from "../components/FormTextField";
import { selectCurrentUser, setUser } from "../features/auth/authSlice";
import { getErrorMessage } from "../utils/errors";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: "",
    },
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (form) => {
    setSuccess("");
    setError("");
    // Omit an empty password to avoid overwriting the existing one.
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      const updated = await updateProfile(payload).unwrap();
      dispatch(setUser(updated));
      reset({ ...form, password: "" });
      setSuccess("Збережено");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <FormCard title="Мій профіль" error={error} success={success} onSubmit={handleSubmit(onSubmit)}>
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
        label="Новий пароль (необов'язково)"
        rules={{
          minLength: { value: 6, message: "Пароль має містити щонайменше 6 символів" },
        }}
      />
      <Button type="submit" variant="contained" disabled={isLoading}>Зберегти</Button>
    </FormCard>
  );
}