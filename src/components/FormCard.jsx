import { Alert, Paper, Typography } from "@mui/material";

export default function FormCard({ title, error, success, onSubmit, children }) {
  return (
    <Paper
      component="form"
      noValidate
      onSubmit={onSubmit}
      sx={{ p: 3, maxWidth: 420, mx: "auto", mb: 3, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5">{title}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {children}
    </Paper>
  );
}