import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./app/routes";
import Layout from "./layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useRestoreSession } from "./features/auth/useRestoreSession";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import AdminItemsPage from "./pages/admin/AdminItemsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import "./theme/global.css";

export default function App() {
  useRestoreSession();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<CatalogPage />} />
          <Route path={ROUTES.cart} element={<CartPage />} />
          <Route path={ROUTES.orders} element={<OrdersPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path={ROUTES.adminItems} element={<AdminItemsPage />} />
            <Route path={ROUTES.adminUsers} element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}