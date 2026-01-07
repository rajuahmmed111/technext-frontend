import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // login
    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // logout
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
