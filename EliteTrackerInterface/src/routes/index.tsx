import { Route, Routes } from "react-router";
import UserLayout from "../layout/userLayout";
import Auth from "../screens/auth";
import Habits from "../screens/habits";
import Login from "../screens/login";
import TimeFocus from "../screens/time-focus";
import PrivateRoutes from "./privateRoutes";

const Router = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="autenticacao" element={<Auth />} />

    <Route element={<PrivateRoutes />}>
      <Route element={<UserLayout />}>
        <Route path="/tempo-de-foco" element={<TimeFocus />} />
        <Route path="/habitos" element={<Habits />} />
      </Route>
    </Route>
  </Routes>
);

export default Router;
