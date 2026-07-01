import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import { router } from "@/app/router";
import AuthSessionReset from "@/features/auth/components/AuthSessionReset";
import "@/styles/index.css";
import {store} from "@/store";
import { queryClient } from "@/lib/query/queryClient";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthSessionReset />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
);
