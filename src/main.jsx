import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

// Create a client
// const queryClient = new QueryClient({
//   defaultOptions : {
//     queries : {
//       staleTime : Infinity,
//       refetchInterval: Infinity, 
//       refetchOnMount: false,
//       refetchOnWindowFocus: false,
//     }
//   }
// });

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
