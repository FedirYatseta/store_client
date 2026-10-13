import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer, { TOKEN_KEY } from "../features/auth/authSlice";
import cartReducer, { CART_KEY } from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

// Зберігаємо токен і кошик між перезавантаженнями сторінки
store.subscribe(() => {
  const { auth, cart } = store.getState();
  try {
    if (auth.token) localStorage.setItem(TOKEN_KEY, auth.token);
    else localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(CART_KEY, JSON.stringify(cart.lines));
  } catch {
    /* localStorage недоступний, не критично */
  }
});