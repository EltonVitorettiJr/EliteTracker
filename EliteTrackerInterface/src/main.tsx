import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./hooks/useUser";
import Router from "./routes";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { DatesProvider } from "@mantine/dates";

dayjs.locale("pt-br");

// biome-ignore lint/style/noNonNullAssertion: <Falso positivo do Biome quando usado com React>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <MantineProvider defaultColorScheme="dark">
        <DatesProvider settings={{ locale: "pt-br", firstDayOfWeek: 0 }}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </DatesProvider>
      </MantineProvider>
    </UserProvider>
  </StrictMode>,
);
