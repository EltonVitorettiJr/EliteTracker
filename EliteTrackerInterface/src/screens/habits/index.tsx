import { TrashIcon } from "@phosphor-icons/react";
import styles from "./styles.module.css";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";

const Habits = () => {
  return (
    <div className={styles.container}>
      <section className={styles.content} style={{ borderRight: "1px solid var(--border-color)" }}>
        <header className={styles.header}>
          <h1>Hábitos Diários</h1>
          <p>(data de hoje)</p>
        </header>

        <div className={styles.inputContainer}>
          <input type="text" placeholder="Digite um novo hábito..." className={styles.input} />
          <Button className={styles.button}>
            <PaperPlaneRightIcon size={20} />
          </Button>
        </div>

        <div className={styles.habits}>
          <div className={styles.habit}>
            <p>exemplo</p>
            <Checkbox />
            <Button className={styles.deleteButton}>
              <TrashIcon size={20} />
            </Button>
          </div>
        </div>

      </section>


      <section className={styles.content}>
        <header className={styles.header} style={{ margin: "20px 0 20px 5px" }}><h2>(nome do hábito)</h2></header>


        <div className={styles.summary}>
          <div className={styles.completedDays}>
            <h3>00/30</h3>
            <p>Dias Concluidos</p>
          </div>

          <div className={styles.percentage}>
            <h3>00%</h3>
            <p>Porcentagem</p>
          </div>
        </div>


        <div>
          <p>(calendário)</p>
        </div>
      </section>
    </div>
  );
}

export default Habits