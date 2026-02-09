import styles from "./styles.module.css";

interface ButtonProps {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return (
    <button type="button" className={styles.container}>
      {children}
    </button>
  );
};

export default Button;
