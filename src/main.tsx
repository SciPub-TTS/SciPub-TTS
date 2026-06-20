import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import "@/app/i18n";
import { bootstrapAuthSessionOnAppLoad } from "@/features/auth/components/AuthSessionReset";
import { queryClient } from "@/lib/query/queryClient";
import { store } from "@/store";
import "@/styles/index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
