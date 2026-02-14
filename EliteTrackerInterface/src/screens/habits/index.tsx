import { TrashIcon } from "@phosphor-icons/react";
import styles from "./styles.module.css";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import api from "../../services/api";
import { useEffect, useState } from "react";
import type { Habit } from "../../types/habit";
import dayjs from "dayjs";

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [inputValue, setInputValue] = useState("")

  const todayFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo"
  }).format(new Date())

  const today = dayjs().startOf("day").format("DD/MM/YYYY")

  const loadHabits = async () => {
    const response = await api.get("/habits");
    setHabits(response.data);
  }

  useEffect(() => {
    loadHabits();
  }, [])

  const filteredHabits = habits
    .filter((habit) =>
      habit.name.toLowerCase().includes(inputValue.toLowerCase())
    )

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!inputValue.trim()) {
      throw new Error('The new habit must have a name!')
    }

    await api.post("/habits", { name: inputValue })

    loadHabits()

    setInputValue("")
  }

  const deleteHabit = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este hábito?")) {
      await api.delete(`/habits/${id}`)

      loadHabits()
    }
  }

  return (
    <div className={styles.container}>
      <section
        className={styles.content}
        style={{ borderRight: "1px solid var(--border-color)" }}
      >
        <header className={styles.header}>
          <h1>Hábitos Diários</h1>
          <p>Hoje, {todayFormat}</p>
        </header>

        <form className={styles.inputContainer} onSubmit={(event) => handleSubmit(event)}>
          <input
            type="text"
            placeholder="Digite um novo hábito..."
            className={styles.input}
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value) }}
          />
          <Button
            className={styles.button}
            type="submit">
            <PaperPlaneRightIcon size={20} />
          </Button>
        </form>

        <div className={styles.habits}>
          {filteredHabits.map((habit) => (
            <div className={styles.habit} key={habit._id}>
              <p>{habit.name}</p>
              <Checkbox
                checked={habit.completedDates.some((date) =>
                  dayjs(date).format("DD/MM/YYYY") === today)}
                id={habit._id}
              />
              <Button
                className={styles.deleteButton}
                onClick={() => deleteHabit(habit._id)}
              >
                <TrashIcon size={20} />
              </Button>
            </div>
          ))}
        </div>
      </section>


      <section className={styles.content}>
        <header
          className={styles.header}
          style={{ margin: "20px 0 20px 5px" }}
        >
          <h2>(nome do hábito)</h2>
        </header>


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