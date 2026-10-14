import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { selectCurrentUser, selectIsAdmin } from "../features/auth/authSlice";
import { useLogout } from "../features/auth/useLogout";
import { selectCartCount } from "../features/cart/cartSlice";
import NavButton from "./NavButton";

export default function Layout() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.login);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <Typography variant="h6" component={RouterLink} to={ROUTES.catalog} sx={{ color: "inherit", textDecoration: "none", mr: 2 }}>
            Store
          </Typography>

          {user && (
            <>
              <NavButton to={ROUTES.catalog}>Catalog</NavButton>
              <NavButton to={ROUTES.cart}>
                <Badge badgeContent={cartCount} color="secondary" sx={{ mr: 1 }}>
                  <ShoppingCartIcon />
                </Badge>
                Cart
              </NavButton>
              <NavButton to={ROUTES.orders}>My orders</NavButton>
              <NavButton to={ROUTES.profile}>Profile</NavButton>
              {isAdmin && (
                <>
                  <NavButton to={ROUTES.adminItems}>Items (admin)</NavButton>
                  <NavButton to={ROUTES.adminUsers}>Users (admin)</NavButton>
                </>
              )}
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Sign out ({user.first_name})
            </Button>
          ) : (
            <>
              <NavButton to={ROUTES.login}>Sign in</NavButton>
              <NavButton to={ROUTES.register}>Sign up</NavButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3, height: "calc(100% - 64px)" }}>
        <Outlet />
      </Container>
    </>
  );
}