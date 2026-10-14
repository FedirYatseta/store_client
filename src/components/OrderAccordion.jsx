import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, CircularProgress, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from "@mui/material";
import { useState } from "react";
import { useGetOrderQuery } from "../api/ordersApi";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatPrice } from "../utils/format";

export default function OrderAccordion({ order }) {
  const [expanded, setExpanded] = useState(false);
  const { data: details, isLoading, error } = useGetOrderQuery(order.id, { skip: !expanded });

  return (
    <Accordion expanded={expanded} onChange={(_, isExpanded) => setExpanded(isExpanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ flexGrow: 1 }}>
          Order #{order.id} placed on {formatDate(order.created_at)}
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
                <TableCell>Item</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
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
