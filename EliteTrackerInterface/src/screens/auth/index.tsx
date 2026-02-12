
import { useNavigate, useSearchParams } from 'react-router'
import styles from './styles.module.css'
import { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getUserInfo } = useUser();

  useEffect(() => {
    const handleAuth = async () => {
      await getUserInfo(String(searchParams.get("code")))

      navigate("/habitos")
    }

    handleAuth();
  }, [])

  return (
    <div className={styles.container}>
      <h1>Carregando...</h1>
    </div>
  )
}

export default Auth