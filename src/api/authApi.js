import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (user) => ({ url: "/login", method: "POST", body: { user } }),
      // Devise JWT returns the token in a header, not in the response body.
      transformResponse: (response, meta) => ({
        user: response.user,
        token: meta.response.headers.get("Authorization"),
      }),
    }),
    signup: build.mutation({
      query: (user) => ({ url: "/signup", method: "POST", body: { user } }),
    }),
    logout: build.mutation({
      query: () => ({ url: "/logout", method: "DELETE" }),
    }),
    getProfile: build.query({
      query: () => "/profile",
    }),
    updateProfile: build.mutation({
      query: (user) => ({ url: "/profile", method: "PATCH", body: { user } }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;