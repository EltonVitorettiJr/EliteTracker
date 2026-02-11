import { ListChecksIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react"
import styles from "./styles.module.css"
import { Link, useLocation } from "react-router"

const Sidebar = () => {
  const { pathname } = useLocation()

  return (
    <aside className={styles.container}>
      <div className={styles.content}>

        <img src="https://github.com/EltonVitorettiJr.png" alt="Foto de Perfil" className={styles.userImg} />
        <Link className={styles.link} to="/habitos" data-active={pathname === "/habitos"}>
          <ListChecksIcon size={32} />
        </Link>

        <Link className={styles.link} to="/tempo-de-foco" data-active={pathname === "/tempo-de-foco"}>
          <TimerIcon size={32} />
        </Link>
      </div>

      <Link className={styles.link} style={{ marginBottom: "30px" }} to="/">
        <SignOutIcon size={32} />
      </Link>
    </aside>
  )
}

export default Sidebar