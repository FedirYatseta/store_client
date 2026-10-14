import { Alert, CircularProgress, Typography } from "@mui/material";
import { useGetOrdersQuery } from "../api/ordersApi";
import OrderAccordion from "../components/OrderAccordion";
import { getErrorMessage } from "../utils/errors";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{getErrorMessage(error)}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>My orders</Typography>
      {orders.length === 0 && <Typography>You have no orders yet.</Typography>}
      {orders.map((order) => <OrderAccordion key={order.id} order={order} />)}
    </>
  );
}