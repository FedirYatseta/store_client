import { useDispatch } from "react-redux";
import { baseApi } from "../../api/baseApi";
import { useLogoutMutation } from "../../api/authApi";
import { clearCart } from "../cart/cartSlice";
import { clearCredentials } from "./authSlice";

export function useLogout() {
  const dispatch = useDispatch();
  const [logoutRequest] = useLogoutMutation();

  return async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      /* токен міг уже протухнути: все одно виходимо локально */
    }
    dispatch(clearCredentials());
    dispatch(clearCart());
    dispatch(baseApi.util.resetApiState()); // скидаємо кеш, щоб наступний користувач не бачив чужі дані
  };
}