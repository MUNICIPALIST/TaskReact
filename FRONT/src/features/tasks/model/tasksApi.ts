import axios from "axios";
import { Task } from "../../../entities/task";

const API_URL = "/api/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
    return [];
  }
};

export const addTask = async (task: Omit<Task, "id">): Promise<Task | undefined> => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении задачи:", error);
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
  }
};

export const completeTask = async (id: number): Promise<Task | undefined> => {
  try {
    const response = await axios.put(`${API_URL}/${id}/done`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при завершении задачи:", error);
  }
};

export const formatRemainingTime = (date: Date): string => {
  const now = new Date();
  const difference = date.getTime() - now.getTime();

  if (difference <= 0) return "00:00:00";

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
