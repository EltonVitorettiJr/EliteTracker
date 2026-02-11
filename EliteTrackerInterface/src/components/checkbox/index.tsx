import { CheckIcon } from "@phosphor-icons/react"
import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";

import styles from "./styles.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
}

const Checkbox = ({ checked, ...props }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        className={styles.input}
        onChange={handleChange}
        {...props}
      />

      <div
        className={styles.iconContainer}
        style={{ backgroundColor: `${isChecked ? "#0058cb" : ""}` }}
      >
        {isChecked && (<CheckIcon size={12} weight="bold" color="var(--text-color)" />)}
      </div>
    </div>
  )
}

export default Checkbox