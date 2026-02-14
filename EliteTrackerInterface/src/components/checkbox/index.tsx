import { CheckIcon } from "@phosphor-icons/react"
import { useState, type InputHTMLAttributes } from "react";

import styles from "./styles.module.css";
import api from "../../services/api";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  id: string
}

const Checkbox = ({ checked, id, ...props }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = async (id: string) => {
    const response = await api.patch(`/habits/${id}/toggle`)
    setIsChecked(!isChecked)

    console.log(response);
  }

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        className={styles.input}
        onChange={() => handleToggle(id)}
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