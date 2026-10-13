import { baseApi } from "./baseApi";

export const itemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getItems: build.query({
      query: (q = "") => ({ url: "/items", params: { q } }),
      providesTags: ["Item"],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;