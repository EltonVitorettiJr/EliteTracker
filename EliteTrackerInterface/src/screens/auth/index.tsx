import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useUser } from "../../hooks/useUser";
import styles from "./styles.module.css";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getUserInfo } = useUser();

  useEffect(() => {
    const handleAuth = async () => {
      await getUserInfo(String(searchParams.get("code")));

      navigate("/habitos");
    };

    handleAuth();
  }, [getUserInfo, navigate, searchParams.get]);

  return (
    <div className={styles.container}>
      <h1>Carregando...</h1>
    </div>
  );
};

export default Auth;
