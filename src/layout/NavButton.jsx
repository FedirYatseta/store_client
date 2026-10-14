import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NavButton({ to, children, ...props }) {
  return (
    <Button color="inherit" component={RouterLink} to={to} {...props}>
      {children}
    </Button>
  );
}
