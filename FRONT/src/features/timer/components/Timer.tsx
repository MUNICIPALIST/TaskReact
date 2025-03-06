// src/features/timer/components/Timer.tsx
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { incrementRound, setMode } from "../model/timerSlice";
import useCountdown from "../hooks/useCountdown";
import { player } from "../model/player";

const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const { mode, round } = useSelector((state: RootState) => state.timer);

  const { ticking, start, stop, reset, timeLeft, progress } = useCountdown({
    // Пример: 25 минут для "pomodoro"
    minutes: mode === "pomodoro" ? 25 : mode === "short_break" ? 5 : 15,
    onStart: () => {},
    onStop: () => {},
    onComplete: () => {
      next();
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const jumpTo = useCallback(
    (m: "pomodoro" | "short_break" | "long_break") => {
      reset();
      dispatch(setMode(m));
    },
    [dispatch, reset]
  );

  const next = useCallback(() => {
    if (mode === "long_break" || mode === "short_break") {
      jumpTo("pomodoro");
      start();
    } else {
      jumpTo("short_break");
      dispatch(incrementRound());
    }
  }, [mode, dispatch, jumpTo, start]);

  const toggleTimer = useCallback(() => {
    ticking ? stop() : start();
  }, [ticking, start, stop]);

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${mode}`;
  }, [timeLeft, mode]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Прогресс-бар */}
      <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Кнопки переключения режимов */}
      <div className="flex gap-2">
        {(["pomodoro", "short_break", "long_break"] as const).map((m) => (
          <button
            key={m}
            onClick={() => jumpTo(m)}
            className={`px-3 py-1 rounded ${
              mode === m ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {m.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Отображение времени */}
      <div className="text-6xl font-bold">
        {formatTime(timeLeft)}
      </div>

      {/* Кнопки управления */}
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded"
        >
          {ticking ? "Stop" : "Start"}
        </button>
        <button
          onClick={next}
          className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded"
        >
          Next
        </button>
      </div>

      {/* Текущий раунд */}
      <div className="text-gray-600">
        Round #{round}
      </div>
    </div>
  );
};

export default Timer;
