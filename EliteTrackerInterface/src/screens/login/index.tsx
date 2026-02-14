import { GithubLogoIcon } from "@phosphor-icons/react";
import Button from "../../components/button";
import styles from "./styles.module.css";
import api from "../../services/api";

const Login = () => {

  const handleLogin = async () => {
    const { data } = await api.get("/auth");

    console.log(data);

    window.location.href = data;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Entre com</h1>
        <Button onClick={() => handleLogin()}>
          <GithubLogoIcon size={20} />
          GitHub
        </Button>
        <p>Ao entrar com o GitHub, eu concordo com os Termos de Serviço</p>
      </div>
    </div>
  );
};

export default Login;
