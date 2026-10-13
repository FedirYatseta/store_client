import { createSlice } from "@reduxjs/toolkit";

export const CART_KEY = "cart";

function loadLines() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

// lines: [{ item, quantity }]
const cartSlice = createSlice({
  name: "cart",
  initialState: { lines: loadLines() },
  reducers: {
    addItem(state, { payload: { item, quantity } }) {
      const line = state.lines.find((l) => l.item.id === item.id);
      if (line) line.quantity += quantity;
      else state.lines.push({ item, quantity });
    },
    setQuantity(state, { payload: { itemId, quantity } }) {
      const line = state.lines.find((l) => l.item.id === itemId);
      if (line) line.quantity = quantity;
    },
    removeItem(state, { payload: itemId }) {
      state.lines = state.lines.filter((l) => l.item.id !== itemId);
    },
    clearCart(state) {
      state.lines = [];
    },
  },
});

export const { addItem, setQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartLines = (state) => state.cart.lines;
export const selectCartCount = (state) =>
  state.cart.lines.reduce((sum, l) => sum + l.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.lines.reduce((sum, l) => sum + Number(l.item.price) * l.quantity, 0);