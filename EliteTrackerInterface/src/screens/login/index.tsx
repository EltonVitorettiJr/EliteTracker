import { GithubLogoIcon } from "@phosphor-icons/react";
import Button from "../../components/button";
import styles from "./styles.module.css";

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Entre com</h1>
        <Button>
          <GithubLogoIcon size={20} />
          GitHub
        </Button>
        <p>Ao entrar com o GitHub, eu concordo com os Termos de Serviço</p>
      </div>
    </div>
  );
};

export default Login;
