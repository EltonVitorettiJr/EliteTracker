import { Outlet } from "react-router"
import Sidebar from "../../components/sidebar"

import styles from "./styles.module.css"

const UserLayout = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default UserLayout