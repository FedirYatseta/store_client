import { Controller } from "react-hook-form";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

const EMAIL_RULE = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Enter a valid email address",
};

export default function FormTextField({ control, name, rules, type, children, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
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
            type={type === "password" && showPassword ? "text" : type}
            inputRef={ref}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            slotProps={{
              input: {
                endAdornment: type === "password" && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      edge="end"
                      onClick={() => setShowPassword((visible) => !visible)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
}
