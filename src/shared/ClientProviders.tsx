"use client";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  );
}
