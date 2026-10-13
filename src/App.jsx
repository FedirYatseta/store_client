import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
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

export default function App() {
  useRestoreSession();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/admin/items" element={<ProtectedRoute adminOnly><AdminItemsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsersPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}