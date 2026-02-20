import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { PlusIcon, TimerIcon } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import Button from "../../components/button";
import Info from "../../components/summary";
import api from "../../services/api";
import type { FocusMetrics, FocusTimes } from "../../types/focus-time";
import styles from "./styles.module.css";

interface Timers {
  focus: number;
  rest: number;
}

const TIMER_STATE = {
  PAUSED: "PAUSED",
  FOCUS: "FOCUS",
  REST: "REST",
} as const;

type TimerState = (typeof TIMER_STATE)[keyof typeof TIMER_STATE];

const timerStateTitle = {
  [TIMER_STATE.PAUSED]: "Pausado",
  [TIMER_STATE.FOCUS]: "Em Foco",
  [TIMER_STATE.REST]: "Em Descanso",
};

const TimeFocus = () => {
  //Variáveis
  const focusInput = useRef<HTMLInputElement>(null);
  const restInput = useRef<HTMLInputElement>(null);

  const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 });
  const [timerState, setTimerState] = useState<TimerState>(TIMER_STATE.PAUSED);
  const [timeFrom, setTimeFrom] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [currentDate, setCurrentDate] = useState(dayjs().startOf("day"));
  const [focusMetrics, setFocusMetrics] = useState<FocusMetrics[]>([]);
  const [focusTimes, setFocusTimes] = useState<FocusTimes[]>([]);

  const todayFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const currentDateFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(currentDate.toDate());

  //Funções
  const addSeconds = (date: Date, seconds: number) => {
    const time = dayjs(date).add(seconds, "seconds");

    return time.toDate();
  };

  const handleStart = (type: "focus" | "rest") => {
    focusTimer.pause();
    restTimer.pause();

    const now = new Date();

    if (type === "focus") {
      focusTimer.restart(addSeconds(now, timers.focus * 60));

      setTimeFrom(now);
    } else {
      restTimer.restart(addSeconds(now, timers.rest * 60));

      setTimeFrom(now);
    }
  };

  const handleEnd = async () => {
    await api.post("/focus-time", {
      timeFrom: timeFrom?.toISOString(),
      timeTo: new Date().toISOString(),
    });

    setTimeFrom(null);
  };

  const focusTimer = useTimer({
    expiryTimestamp: new Date(),
    async onExpire() {
      if (timerState !== TIMER_STATE.PAUSED) {
        await handleEnd();
      }
    },
  });

  const restTimer = useTimer({
    expiryTimestamp: new Date(),
  });

  const handleAddMinutes = (type: "focus" | "rest") => {
    if (type === "focus") {
      if (focusInput.current) {
        const currentValue = Number(focusInput.current.value);

        const value = currentValue + 5;

        focusInput.current.value = String(value);

        setTimers((old) => ({
          ...old,
          focus: value,
        }));
      }
      return;
    }

    if (restInput.current) {
      const currentValue = Number(restInput.current.value);

      const value = currentValue + 5;

      restInput.current.value = String(value);

      setTimers((old) => ({
        ...old,
        rest: value,
      }));
    }
  };

  const handleCancel = () => {
    setTimers({
      focus: 0,
      rest: 0,
    });

    if (!focusInput.current || !restInput.current) return;

    focusInput.current.value = "";
    restInput.current.value = "";

    setTimerState(TIMER_STATE.PAUSED);
  };

  const handleFocus = () => {
    if (timers.focus <= 0 || timers.rest <= 0) {
      return;
    }

    handleStart("focus");

    setTimerState(TIMER_STATE.FOCUS);
  };

  const handleRest = async () => {
    await handleEnd();

    if (timers.focus <= 0 || timers.rest <= 0) {
      return;
    }

    handleStart("rest");

    setTimerState(TIMER_STATE.REST);
  };

  const handleResume = () => {
    handleStart("focus");

    setTimerState(TIMER_STATE.FOCUS);
  };

  const loadFocusMetrics = async (currentDate: string) => {
    const { data } = await api.get<FocusMetrics[]>("/focus-time/metrics", {
      params: {
        date: currentDate,
      },
    });

    setFocusMetrics(data);
  };

  const loadFocusTime = async (currentDay: string) => {
    const { data } = await api.get<FocusTimes[]>("/focus-time", {
      params: {
        date: currentDay,
      },
    });

    setFocusTimes(data);
  };

  const handleSelectMonth = async (date: string) => {
    setCurrentMonth(dayjs(date));
  };

  const handleSelectDay = (date: Date) => {
    setCurrentDate(dayjs(date));
  };

  const metricsInfoByDay = useMemo(() => {
    const timeMetrics = focusTimes.map((item) => ({
      timeFrom: dayjs(item.timeFrom),
      timeTo: dayjs(item.timeTo),
    }));

    let totalTimeInMinutes = 0;

    if (timeMetrics.length) {
      for (const { timeFrom, timeTo } of timeMetrics) {
        const diff = timeTo.diff(timeFrom, "minutes");

        totalTimeInMinutes += diff;
      }
    }

    return { timeMetrics, totalTimeInMinutes };
  }, [focusTimes]);

  const metricsInfoByMonth = useMemo(() => {
    const completedDates: string[] = [];
    let counter: number = 0;

    if (focusMetrics.length) {
      focusMetrics.forEach((item) => {
        const date = dayjs(`${item._id[0]}-${item._id[1]}-${item._id[2]}`)
          .startOf("day")
          .toISOString();

        completedDates.push(date);
        counter += item.count;
      });
    }

    return { completedDates, counter };
  }, [focusMetrics]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Falso positivo do Biome em funções fora do useEffect>
  useEffect(() => {
    loadFocusMetrics(currentMonth.toISOString());
  }, [currentMonth]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Falso positivo do Biome em funções fora do useEffect>
  useEffect(() => {
    loadFocusTime(currentDate.toISOString());
  }, [currentDate]);

  return (
    <div className={styles.container}>
      <section
        className={styles.content}
        style={{ borderRight: "1px solid var(--neutral)" }}
      >
        <header className={styles.header}>
          <h1>Tempo de Foco</h1>
          <p>Hoje, {todayFormat}</p>
        </header>

        <div className={styles.timeFocusContainer}>
          <div className={styles.inputContainer}>
            <PlusIcon
              weight="bold"
              style={{ marginLeft: "6px", cursor: "pointer" }}
              onClick={() => handleAddMinutes("focus")}
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Tempo de Foco"
              ref={focusInput}
              disabled
            />
          </div>

          <div className={styles.inputContainer}>
            <PlusIcon
              weight="bold"
              style={{ marginLeft: "6px", cursor: "pointer" }}
              onClick={() => handleAddMinutes("rest")}
            />
            <input
              type="text"
              className={styles.input}
              placeholder="Tempo de Descanso"
              ref={restInput}
              disabled
            />
          </div>
        </div>

        <div className={styles.timerContainer}>
          <div className={styles.timer}>
            <strong>{timerStateTitle[timerState]}</strong>

            {timerState === TIMER_STATE.PAUSED && (
              <span>{`${String(timers.focus).padStart(2, "00")}:00`}</span>
            )}

            {timerState === TIMER_STATE.FOCUS && (
              <span>
                {`${String(focusTimer.minutes).padStart(2, "00")}:${String(focusTimer.seconds).padStart(2, "00")}`}
              </span>
            )}

            {timerState === TIMER_STATE.REST && (
              <span>
                {`${String(restTimer.minutes).padStart(2, "00")}:${String(restTimer.seconds).padStart(2, "00")}`}
              </span>
            )}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          {timerState === TIMER_STATE.PAUSED && (
            <Button
              disabled={timers.focus <= 0 || timers.rest <= 0}
              onClick={() => handleFocus()}
            >
              Começar
            </Button>
          )}

          {timerState === TIMER_STATE.FOCUS && (
            <Button onClick={() => handleRest()}>Iniciar Descanso</Button>
          )}

          {timerState === TIMER_STATE.REST && (
            <Button onClick={() => handleResume()}>Retomar</Button>
          )}

          <Button variant="error" onClick={() => handleCancel()}>
            Cancelar
          </Button>
        </div>
      </section>

      <section style={{ height: "100%", width: "100%" }}>
        <div className={styles.content}>
          <header
            className={styles.header}
            style={{ margin: "20px 0 20px 5px" }}
          >
            <h2>Estatísticas</h2>
          </header>
          <div className={styles.summary}>
            <Info
              label="Ciclos Totais"
              value={String(metricsInfoByMonth.counter)}
            />
            <Info
              label="Tempo Total de Foco"
              value={`${metricsInfoByDay.totalTimeInMinutes} minutos`}
            />
          </div>

          <strong style={{ width: "100%", textAlign: "left" }}>
            {currentDateFormat}
          </strong>

          <div className={styles.metricsByDayContainer}>
            {metricsInfoByDay.timeMetrics.map((time) => (
              <div
                key={String(time.timeFrom)}
                className={styles.metricsByDayContent}
              >
                <div className={styles.metricsByDayIndicator}>
                  <TimerIcon color="var(--info-color)" weight="bold" />
                  <span>{`${String(time.timeFrom.hour()).padStart(2, "00")}:${String(time.timeFrom.minute()).padStart(2, "00")} - `}</span>

                  <span>{`${String(time.timeTo.hour()).padStart(2, "00")}:${String(time.timeTo.minute()).padStart(2, "00")}`}</span>
                </div>

                <div>
                  <span>{`${time.timeTo.diff(time.timeFrom, "minutes")} minutos`}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.calendarContainer}>
            <Calendar
              size="lg"
              getDayProps={(date) => ({
                selected: dayjs(date).isSame(currentDate),
                onClick: () => handleSelectDay(dayjs(date).toDate()),
              })}
              onMonthSelect={async (date) => handleSelectMonth(date)}
              onNextMonth={async (date) => handleSelectMonth(date)}
              onPreviousMonth={async (date) => handleSelectMonth(date)}
              renderDay={(date) => {
                const day = dayjs(date).date();
                const isSameDate = metricsInfoByMonth.completedDates.some(
                  (item) => {
                    return dayjs(item).isSame(dayjs(date));
                  },
                );
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
      </section>
    </div>
  );
};

export default TimeFocus;
