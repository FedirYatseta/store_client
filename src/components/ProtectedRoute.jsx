import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { selectCurrentUser, selectIsAdmin, selectToken } from "../features/auth/authSlice";

export default function ProtectedRoute({ adminOnly = false }) {
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  if (!token) return <Navigate to={ROUTES.login} replace />;

  // Токен є, профіль ще вантажиться (після перезавантаження сторінки)
  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (adminOnly && !isAdmin) return <Navigate to={ROUTES.catalog} replace />;
  return <Outlet />;
}