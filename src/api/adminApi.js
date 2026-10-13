import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminItems: build.query({
      query: () => "/admin/items",
      providesTags: ["AdminItem"],
    }),
    createAdminItem: build.mutation({
      query: (item) => ({ url: "/admin/items", method: "POST", body: { item } }),
      invalidatesTags: ["AdminItem", "Item"], // "Item" also refreshes the public catalog.
    }),
    updateAdminItem: build.mutation({
      query: ({ id, ...item }) => ({ url: `/admin/items/${id}`, method: "PATCH", body: { item } }),
      invalidatesTags: ["AdminItem", "Item"],
    }),
    deleteAdminItem: build.mutation({
      query: (id) => ({ url: `/admin/items/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminItem", "Item"],
    }),

    getAdminUsers: build.query({
      query: () => "/admin/users",
      providesTags: ["AdminUser"],
    }),
    updateAdminUser: build.mutation({
      query: ({ id, ...user }) => ({ url: `/admin/users/${id}`, method: "PATCH", body: { user } }),
      invalidatesTags: ["AdminUser"],
    }),
    deleteAdminUser: build.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetAdminItemsQuery,
  useCreateAdminItemMutation,
  useUpdateAdminItemMutation,
  useDeleteAdminItemMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = adminApi;