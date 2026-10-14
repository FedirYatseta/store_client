import { Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { formatPrice } from "../utils/format";

export default function ItemCard({ item }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{item.name}</Typography>
        <Typography color="text.secondary">{item.description}</Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>{formatPrice(item.price)}</Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <TextField
          type="number"
          size="small"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          slotProps={{ htmlInput: { min: 1 } }}
          sx={{ width: 90 }}
        />
        <Button variant="contained" onClick={() => dispatch(addItem({ item, quantity }))}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
