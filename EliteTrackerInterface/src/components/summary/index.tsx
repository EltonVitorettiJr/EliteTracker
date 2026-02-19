import styles from "./styles.module.css";

interface InfoProps {
  label: string;
  value: string;
}

const Info = ({ label, value }: InfoProps) => {
  return (
    <div className={styles.contentInfo}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
};

export default Info;
