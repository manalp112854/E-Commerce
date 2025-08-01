// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContextCartProvider from "./components/ContextCart.jsx";
import ContextSearchProvider from "./components/SearchContext.jsx";
import { ThemeProvider } from "./components/ThemeContext.jsx";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ContextCartProvider>
          <ContextSearchProvider>
            <App />
          </ContextSearchProvider>
        </ContextCartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
