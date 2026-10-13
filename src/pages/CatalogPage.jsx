import {
  Alert, Box, Button, Card, CardActions, CardContent, LinearProgress, TextField, Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useGetItemsQuery } from "../api/itemsApi";
import { addItem } from "../features/cart/cartSlice";
import { getErrorMessage } from "../utils/errors";
import { formatPrice } from "../utils/format";
import { useDebounce } from "../utils/useDebounce";

function ItemCard({ item }) {
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
          В кошик
        </Button>
      </CardActions>
    </Card>
  );
}

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query); // не шлемо запит на кожну літеру
  const { data: items = [], isFetching, error } = useGetItemsQuery(debouncedQuery);

  return (
    <>
      <Typography variant="h4" gutterBottom>Каталог</Typography>
      <TextField
        fullWidth
        label="Пошук за назвою або описом"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      {isFetching && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(error)}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
        {items.map((item) => <ItemCard key={item.id} item={item} />)}
      </Box>
      {!isFetching && items.length === 0 && <Typography>Нічого не знайдено.</Typography>}
    </>
  );
}