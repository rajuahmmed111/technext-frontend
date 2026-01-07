import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // create user
    createUser: build.mutation({
      query: ({ fullName, email, password }) => ({
        url: "users",
        method: "POST",
        body: { fullName, email, password },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useCreateUserMutation } = userApi;
