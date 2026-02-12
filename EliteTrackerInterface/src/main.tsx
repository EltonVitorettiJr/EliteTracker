import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Router from "./routes";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./hooks/useUser";

// biome-ignore lint/style/noNonNullAssertion: <Falso positivo do Biome quando usado com React>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
);
