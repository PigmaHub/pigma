import "@pigma/ui/globals.css";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";
import React from "react";

const root = document.getElementById("root");

createRoot(root!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
