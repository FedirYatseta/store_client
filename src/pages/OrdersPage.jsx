import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetOrderQuery, useGetOrdersQuery } from "../api/ordersApi";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatPrice } from "../utils/format";

function OrderAccordion({ order }) {
  const [expanded, setExpanded] = useState(false);
  const { data: details, isLoading, error } = useGetOrderQuery(order.id, { skip: !expanded });

  return (
    <Accordion expanded={expanded} onChange={(_, isExpanded) => setExpanded(isExpanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ flexGrow: 1 }}>
          Замовлення #{order.id} від {formatDate(order.created_at)}
        </Typography>
        <Typography fontWeight="bold" sx={{ mr: 2 }}>{formatPrice(order.amount)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading && <CircularProgress size={24} />}
        {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}
        {details && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Товар</TableCell>
                <TableCell>Ціна</TableCell>
                <TableCell>Кількість</TableCell>
                <TableCell>Сума</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.order_descriptions.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.item.name}</TableCell>
                  <TableCell>{formatPrice(d.item.price)}</TableCell>
                  <TableCell>{d.quantity}</TableCell>
                  <TableCell>{formatPrice(Number(d.item.price) * d.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{getErrorMessage(error)}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Мої замовлення</Typography>
      {orders.length === 0 && <Typography>Замовлень ще немає.</Typography>}
      {orders.map((order) => <OrderAccordion key={order.id} order={order} />)}
    </>
  );
}