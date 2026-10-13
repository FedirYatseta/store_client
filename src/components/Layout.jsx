import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { ROUTES } from "../app/routes";
import { selectCurrentUser, selectIsAdmin } from "../features/auth/authSlice";
import { useLogout } from "../features/auth/useLogout";
import { selectCartCount } from "../features/cart/cartSlice";

function NavButton({ to, children, ...props }) {
  return (
    <Button color="inherit" component={RouterLink} to={to} {...props}>
      {children}
    </Button>
  );
}

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
              <NavButton to={ROUTES.catalog}>Каталог</NavButton>
              <NavButton to={ROUTES.cart}>
                <Badge badgeContent={cartCount} color="secondary" sx={{ mr: 1 }}>
                  <ShoppingCartIcon />
                </Badge>
                Кошик
              </NavButton>
              <NavButton to={ROUTES.orders}>Мої замовлення</NavButton>
              <NavButton to={ROUTES.profile}>Профіль</NavButton>
              {isAdmin && (
                <>
                  <NavButton to={ROUTES.adminItems}>Товари (адмін)</NavButton>
                  <NavButton to={ROUTES.adminUsers}>Користувачі (адмін)</NavButton>
                </>
              )}
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Вийти ({user.first_name})
            </Button>
          ) : (
            <>
              <NavButton to={ROUTES.login}>Вхід</NavButton>
              <NavButton to={ROUTES.register}>Реєстрація</NavButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}