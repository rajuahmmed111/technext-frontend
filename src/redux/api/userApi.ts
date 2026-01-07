import { baseApi } from "../baseApi";

const visionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // create user
    createUser: build.query({
      query: () => ({
        url: "users",
        method: "POST",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useCreateUserQuery } = visionApi;
