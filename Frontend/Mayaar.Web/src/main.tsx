import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";
import {
    ToastProvider,
} from "./context/ToastContext";
import ToastContainer from "./components/common/ToastContainer";
import "./index.css";

/**
 * Creates the TanStack Query client used by the
 * entire Mayaar application.
 *
 * QueryClient manages:
 *
 * - Server state
 * - API requests
 * - Query caching
 * - Query invalidation
 * - Loading states
 * - Error states
 * - Background refetching
 */
const queryClient = new QueryClient();

/**
 * Finds the HTML element where React will mount
 * the Mayaar application.
 *
 * The element is normally defined in index.html:
 *
 * <div id="root"></div>
 */
const rootElement =
    document.getElementById("root");

/**
 * Stops application startup if the root HTML element
 * cannot be found.
 *
 * Without this element React has nowhere to render
 * the application.
 */
if (!rootElement) {
    throw new Error(
        "Unable to find the root HTML element.",
    );
}

/**
 * Creates and renders the Mayaar React application.
 *
 * Provider hierarchy:
 *
 * StrictMode
 *     │
 *     └── ToastProvider
 *             │
 *             └── QueryClientProvider
 *                     │
 *                     └── BrowserRouter
 *                             │
 *                             └── App
 *
 * ToastProvider:
 *
 * Makes the global toast notification system available
 * to every component inside the application.
 *
 * QueryClientProvider:
 *
 * Makes TanStack Query available to every component
 * that needs to communicate with the API.
 *
 * BrowserRouter:
 *
 * Enables client-side routing using React Router.
 */
createRoot(rootElement).render(
    <StrictMode>
        <ToastProvider>
            <QueryClientProvider
                client={queryClient}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>

            {/*
             * ToastContainer is placed outside the
             * application pages but inside ToastProvider.
             *
             * This allows notifications to remain visible
             * regardless of which page the user is viewing.
             */}
            <ToastContainer />
        </ToastProvider>
    </StrictMode>,
);