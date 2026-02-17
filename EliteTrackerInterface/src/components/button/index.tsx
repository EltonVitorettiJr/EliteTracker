import type { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "info" | "error";
}

const Button = ({ children, variant = "info", disabled = false, ...props }: ButtonProps) => {
  return (
    <button
      className={clsx(styles.container, variant === 'error' && styles.error, disabled && styles.disabled)} {...props}
    >
      {children}
    </button>
  );
};

export default Button;
