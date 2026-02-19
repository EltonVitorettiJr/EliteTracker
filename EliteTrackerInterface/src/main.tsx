import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./hooks/useUser";
import Router from "./routes";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";

// biome-ignore lint/style/noNonNullAssertion: <Falso positivo do Biome quando usado com React>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <MantineProvider defaultColorScheme="dark">
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </MantineProvider>
    </UserProvider>
  </StrictMode>,
);
