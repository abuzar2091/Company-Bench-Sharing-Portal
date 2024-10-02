import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function QueryProvider({ children }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
