import { baseApi } from "./baseApi";

const sendQuoteApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // send quote
    sendQuote: build.mutation({
      query: (data) => ({
        url: "/send-quote",
        method: "POST",
        body: data,
      }),
    }),
  }),
  // overrideExisting: true,
});

export const { useSendQuoteMutation } = sendQuoteApi;
