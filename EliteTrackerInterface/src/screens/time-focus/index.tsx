import styles from './styles.module.css'
import api from '../../services/api'
import dayjs from 'dayjs'
import { PlusIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import Button from '../../components/button'
import { useTimer } from 'react-timer-hook'

interface Timers {
  focus: number
  rest: number
}

const TIMER_STATE = {
  PAUSED: "PAUSED",
  FOCUS: "FOCUS",
  REST: "REST"
} as const

type TimerState = typeof TIMER_STATE[keyof typeof TIMER_STATE]

const TimeFocus = () => {
  //Variáveis
  const focusInput = useRef<HTMLInputElement>(null)
  const restInput = useRef<HTMLInputElement>(null)

  const [timers, setTimers] = useState<Timers>({ focus: 0, rest: 0 })
  const [timerState, setTimerState] = useState<TimerState>(TIMER_STATE.PAUSED)
  const [timeFrom, setTimeFrom] = useState<Date | null>(null)

  //Funções
  const addSeconds = (date: Date, seconds: number) => {
    const time = dayjs(date).add(seconds, "seconds")

    return time.toDate()
  }

  const handleStart = () => {
    const now = new Date()

    focusTimer.restart(addSeconds(now, 5))

    setTimeFrom(now)
  }

  const handleEnd = () => {
    console.log({
      timeFrom: timeFrom?.toISOString(),
      timeTo: new Date().toISOString()
    });

    setTimeFrom(null)
  }

  const focusTimer = useTimer({
    expiryTimestamp: new Date(),
    onExpire() {
      if (timerState !== TIMER_STATE.PAUSED) {
        handleEnd()
      }
    }
  })

  const handleAddMinutes = (type: "focus" | "rest") => {
    if (type === "focus") {
      if (focusInput.current) {
        const currentValue = Number(focusInput.current.value)

        const value = currentValue + 5

        focusInput.current.value = String(value)

        setTimers((old) => ({
          ...old,
          focus: value
        }))
      }
      return
    }

    if (restInput.current) {
      const currentValue = Number(restInput.current.value)

      const value = currentValue + 5

      restInput.current.value = String(value)

      setTimers((old) => ({
        ...old,
        rest: value
      }))
    }
  }

  const handleCancel = () => {
    setTimers({
      focus: 0,
      rest: 0
    })

    if (!focusInput.current || !restInput.current) return

    focusInput.current.value = ""
    restInput.current.value = ""

    setTimerState(TIMER_STATE.PAUSED)
  }

  const handleFocus = () => {
    if (timers.focus <= 0 || timers.rest <= 0) {
      return
    }

    handleStart()

    setTimerState(TIMER_STATE.FOCUS)
  }

  const handleRest = () => {
    setTimerState(TIMER_STATE.REST)

    handleEnd()
  }

  const handleResume = () => {
    handleStart()

    setTimerState(TIMER_STATE.FOCUS)
  }

  const todayFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo"
  }).format(new Date())

  // const today = dayjs().startOf("day").format("DD/MM/YYYY")

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
              weight='bold'
              style={{ marginLeft: "6px", cursor: "pointer" }}
              onClick={() => handleAddMinutes("focus")}
            />
            <input
              type="text"
              className={styles.input}
              placeholder='Tempo de Foco'
              ref={focusInput}
              disabled
            />
          </div>

          <div className={styles.inputContainer}>
            <PlusIcon
              weight='bold'
              style={{ marginLeft: "6px", cursor: "pointer" }}
              onClick={() => handleAddMinutes("rest")}
            />
            <input
              type="text"
              className={styles.input}
              placeholder='Tempo de Descanso'
              ref={restInput}
              disabled
            />
          </div>
        </div>

        <div className={styles.timerContainer}>
          <div className={styles.timer}>
            {timerState === TIMER_STATE.PAUSED && (
              <span>{`${String(timers.focus).padStart(2, "00")}:00`}</span>
            )}

            {timerState === TIMER_STATE.FOCUS && (
              <span>
                {`${String(focusTimer.minutes).padStart(2, "00")}:${String(focusTimer.seconds).padStart(2, "00")}`}
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

          <Button variant='error' onClick={() => handleCancel()}>Cancelar</Button>
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

export default TimeFocus