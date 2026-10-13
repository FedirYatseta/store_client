import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const EMAIL_RULE = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Введіть коректний email",
};

export default function FormTextField({ control, name, rules, type, children, ...props }) {
  const validationRules = type === "email"
    ? { ...rules, pattern: rules?.pattern ?? EMAIL_RULE }
    : rules;

  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => {
        const { ref, ...fieldProps } = field;

        return (
          <TextField
            {...props}
            {...fieldProps}
            type={type}
            inputRef={ref}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
}
