// src/features/timer/model/timerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TimerState {
  mode: "pomodoro" | "short_break" | "long_break";
  round: number;
  // другие настройки таймера, например, звуки, автозапуск и т.д.
}

const initialState: TimerState = {
  mode: "pomodoro",
  round: 1,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<TimerState["mode"]>) => {
      state.mode = action.payload;
    },
    incrementRound: (state) => {
      state.round += 1;
    },
    // Добавьте остальные редьюсеры по необходимости
  },
});

export const { setMode, incrementRound } = timerSlice.actions;
export default timerSlice.reducer;
