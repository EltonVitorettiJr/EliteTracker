import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./styles/global.css";

// biome-ignore lint/style/noNonNullAssertion: <Falso positivo do Biome quando usado com React>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
