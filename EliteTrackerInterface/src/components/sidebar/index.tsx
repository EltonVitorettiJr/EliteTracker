import { ListChecksIcon, SignOutIcon, TimerIcon } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router";
import { useUser } from "../../hooks/useUser";
import styles from "./styles.module.css";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { userData, logOut } = useUser();

  return (
    <aside className={styles.container}>
      <div className={styles.content}>
        <img
          src={userData?.avatarUrl}
          alt={userData?.name}
          className={styles.userImg}
        />
        <Link
          className={styles.link}
          to="/habitos"
          data-active={pathname === "/habitos"}
        >
          <ListChecksIcon size={32} />
        </Link>

        <Link
          className={styles.link}
          to="/tempo-de-foco"
          data-active={pathname === "/tempo-de-foco"}
        >
          <TimerIcon size={32} />
        </Link>
      </div>

      <Link
        className={styles.link}
        style={{ marginBottom: "30px" }}
        to="/"
        onClick={() => logOut()}
      >
        <SignOutIcon size={32} />
      </Link>
    </aside>
  );
};

export default Sidebar;
