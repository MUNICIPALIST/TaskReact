// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "../features/timer/model/timerSlice";
// импортируйте другие редьюсеры, если необходимо

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    // tasks: tasksReducer, ...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
