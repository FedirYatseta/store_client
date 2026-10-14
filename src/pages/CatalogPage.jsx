import {
  Alert, Box, LinearProgress, TextField, Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetItemsQuery } from "../api/itemsApi";
import ItemCard from "../components/ItemCard";
import { getErrorMessage } from "../utils/errors";
import { useDebounce } from "../utils/useDebounce";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query); // Avoid sending a request for every keystroke.
  const { data: items = [], isFetching, error } = useGetItemsQuery(debouncedQuery);

  return (
    <>
      <Typography variant="h4" gutterBottom>Catalog</Typography>
      <TextField
        fullWidth
        label="Search by name or description"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      {isFetching && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(error)}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 2 }}>
        {items.map((item) => <ItemCard key={item.id} item={item} />)}
      </Box>
      {!isFetching && items.length === 0 && <Typography>No items found.</Typography>}
    </>
  );
}