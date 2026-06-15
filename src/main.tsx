import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import "@/app/i18n";
import { bootstrapAuthSessionOnAppLoad } from "@/features/auth/components/AuthSessionReset";
import { queryClient } from "@/lib/query/queryClient";
import { store } from "@/store";
import "@/styles/index.css";

void bootstrapAuthSessionOnAppLoad();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
