import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "../features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set("Authorization", token); 
    return headers;
  },
});


const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && api.endpoint !== "login") {
    api.dispatch(clearCredentials());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Item", "Order", "AdminItem", "AdminUser"],
  endpoints: () => ({}), 
});