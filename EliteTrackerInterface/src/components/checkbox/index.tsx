import { CheckIcon } from "@phosphor-icons/react";
import { type InputHTMLAttributes, useState } from "react";
import api from "../../services/api";
import type { Habit } from "../../types/habit";
import styles from "./styles.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  habit: Habit;
  handleSelectHabit: (habit: Habit) => Promise<void>;
}

const Checkbox = ({
  checked,
  habit,
  handleSelectHabit,
  ...props
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = async (habit: Habit) => {
    await api.patch(`/habits/${habit._id}/toggle`);

    setIsChecked(!isChecked);

    handleSelectHabit(habit);
  };

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        className={styles.input}
        onChange={() => handleToggle(habit)}
        {...props}
      />

      <div
        className={styles.iconContainer}
        style={{ backgroundColor: `${isChecked ? "#0058cb" : ""}` }}
      >
        {isChecked && (
          <CheckIcon size={12} weight="bold" color="var(--white)" />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
