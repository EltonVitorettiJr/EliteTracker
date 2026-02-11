
import Login from "../screens/login";
import Habits from "../screens/habits";
import { Route, Routes } from "react-router";
import TimeFocus from "../screens/time-focus";
import UserLayout from "../layout/userLayout";

const Router = () => (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route path="/" element={<UserLayout />}>
      <Route path="/tempo-de-foco" element={<TimeFocus />} />
      <Route path="/habitos" element={<Habits />} />
    </Route>
  </Routes>
)

export default Router;