import {
  Alert, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../api/ordersApi";
import { ROUTES } from "../app/routes";
import {
  clearCart, removeItem, selectCartLines, selectCartTotal, setQuantity,
} from "../features/cart/cartSlice";
import { getErrorMessage } from "../utils/errors";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lines = useSelector(selectCartLines);
  const total = useSelector(selectCartTotal);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    try {
      // На сервер йдуть лише id і кількість: суму там рахують з актуальних цін
      await createOrder(lines.map((l) => ({ item_id: l.item.id, quantity: l.quantity }))).unwrap();
      dispatch(clearCart());
      navigate(ROUTES.orders);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (lines.length === 0) return <Typography>Кошик порожній.</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Кошик</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              <TableCell>Ціна</TableCell>
              <TableCell>Кількість</TableCell>
              <TableCell>Сума</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map(({ item, quantity }) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) =>
                      dispatch(setQuantity({ itemId: item.id, quantity: Math.max(1, Number(e.target.value) || 1) }))
                    }
                    slotProps={{ htmlInput: { min: 1 } }}
                    sx={{ width: 90 }}
                  />
                </TableCell>
                <TableCell>{formatPrice(Number(item.price) * quantity)}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => dispatch(removeItem(item.id))}>Видалити</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mb: 2 }}>Разом: {formatPrice(total)}</Typography>
      <Button variant="contained" onClick={handlePay} disabled={isLoading}>
        {isLoading ? "Обробка..." : "Оплатити"}
      </Button>
    </>
  );
}