import { Navigate, Outlet } from "react-router";
import { localStorageKey } from "../hooks/useUser";

const PrivateRoutes = () => {
  const userData = localStorage.getItem(localStorageKey);

  if (!userData) {
    return <Navigate to="/" />
  }

  return (
    <Outlet />
  )
}

export default PrivateRoutes;