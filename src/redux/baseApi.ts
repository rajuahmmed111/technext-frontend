import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://technext-backend-three.vercel.app/api/v1",
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
