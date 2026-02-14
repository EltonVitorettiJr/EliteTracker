import { Navigate, Outlet } from "react-router";
import { localStorageKey } from "../constants/localStorageKey";


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