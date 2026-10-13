import { baseApi } from "./baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),
    getOrder: build.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    // lines: [{ item_id, quantity }]
    createOrder: build.mutation({
      query: (lines) => ({ url: "/orders", method: "POST", body: { items: lines } }),
      invalidatesTags: ["Order"], // список замовлень оновиться сам
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderQuery, useCreateOrderMutation } = ordersApi;