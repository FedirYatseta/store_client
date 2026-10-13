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
      /* The token may already have expired; log out locally anyway. */
    }
    dispatch(clearCredentials());
    dispatch(clearCart());
    dispatch(baseApi.util.resetApiState()); // Clear the cache so the next user cannot see someone else's data.
  };
}