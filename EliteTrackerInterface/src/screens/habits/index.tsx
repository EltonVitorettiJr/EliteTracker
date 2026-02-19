import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { TrashIcon } from "@phosphor-icons/react";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";
import Info from "../../components/summary";
import api from "../../services/api";
import type { Habit } from "../../types/habit";
import styles from "./styles.module.css";

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<Habit>({} as Habit);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [inputValue, setInputValue] = useState("");

  const today = dayjs().startOf("day");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    today.startOf("month"),
  );

  const metricsInfo = useMemo(() => {
    const numberOfMonthDays = today.endOf("month").get("date");
    const numberOfDays = metrics.completedDates
      ? metrics.completedDates.length
      : 0;

    const completedDaysPerMonth = `${numberOfDays}/${numberOfMonthDays}`;

    const completeMonthPercentage = `${Math.round((numberOfDays / numberOfMonthDays) * 100)}%`;

    return { completeMonthPercentage, completedDaysPerMonth };
  }, [metrics, today]);

  const todayFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const handleSelectHabit = async (habit: Habit) => {
    setSelectedHabit(habit);
  };

  const loadHabits = async () => {
    const response = await api.get("/habits");
    setHabits(response.data);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Falso positivo do biome, não é necessário que a função seja uma dependência do useEffect>
  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (!selectedHabit) return;

    const fetchMetrics = async () => {
      const { data } = await api.get<Habit>(
        `/habits/${selectedHabit._id}/metrics`,
        {
          params: {
            date: currentMonth.toISOString(),
          },
        },
      );
      setMetrics(data);
    };

    fetchMetrics();
  }, [selectedHabit, currentMonth]);

  const filteredHabits = habits.filter((habit) =>
    habit.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      throw new Error("The new habit must have a name!");
    }

    await api.post("/habits", { name: inputValue });

    await loadHabits();

    setInputValue("");
  };

  const deleteHabit = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este hábito?")) {
      await api.delete(`/habits/${id}`);

      setMetrics({} as Habit);
      setSelectedHabit(null);

      await loadHabits();
    }
  };

  const handleSelectMonth = async (date: string) => {
    setCurrentMonth(dayjs(date).startOf("month"));
  };

  return (
    <div className={styles.container}>
      <section
        className={styles.content}
        style={{ borderRight: "1px solid var(--neutral)" }}
      >
        <header className={styles.header}>
          <h1>Hábitos Diários</h1>
          <p>Hoje, {todayFormat}</p>
        </header>

        <form
          className={styles.inputContainer}
          onSubmit={(event) => handleSubmit(event)}
        >
          <input
            type="text"
            placeholder="Digite um novo hábito..."
            className={styles.input}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button className={styles.button} type="submit">
            <PaperPlaneRightIcon size={20} />
          </Button>
        </form>

        <div className={styles.habits}>
          {filteredHabits.map((habit) => (
            <div
              className={clsx(
                styles.habit,
                habit._id === selectedHabit?._id && styles["habit-active"],
              )}
              key={habit._id}
            >
              {/** biome-ignore lint/a11y/useKeyWithClickEvents: <Falso Positivo entre teclado e mouse> */}
              <p onClick={() => handleSelectHabit(habit)}>{habit.name}</p>
              <Checkbox
                checked={habit.completedDates.some(
                  (date) =>
                    dayjs(date).format("DD/MM/YYYY") ===
                    today.format("DD/MM/YYYY"),
                )}
                habit={habit}
                handleSelectHabit={handleSelectHabit}
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

      <section style={{ height: "100%", width: "100%" }}>
        {selectedHabit && (
          <div className={styles.content}>
            <header
              className={styles.header}
              style={{ margin: "20px 0 20px 5px" }}
            >
              <h2>{selectedHabit?.name}</h2>
            </header>
            <div className={styles.summary}>
              <Info
                label="Dias Concluídos"
                value={metricsInfo.completedDaysPerMonth}
              />
              <Info
                label="Porcentagem"
                value={metricsInfo.completeMonthPercentage}
              />
            </div>
            <div className={styles.calendarContainer}>
              <Calendar
                static
                onMonthSelect={async (date) => handleSelectMonth(date)}
                onNextMonth={async (date) => handleSelectMonth(date)}
                onPreviousMonth={async (date) => handleSelectMonth(date)}
                renderDay={(date) => {
                  const day = dayjs(date).date();
                  const isSameDate = metrics?.completedDates?.some((item) => {
                    return dayjs(item).isSame(dayjs(date));
                  });
                  return (
                    <Indicator
                      size={9}
                      color="var(--info-color)"
                      offset={-2}
                      disabled={!isSameDate}
                    >
                      <div>{day}</div>
                    </Indicator>
                  );
                }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Habits;
