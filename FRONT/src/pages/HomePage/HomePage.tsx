// src/pages/HomePage/HomePage.tsx
import React from "react";
import Timer from "../../features/timer/components/Timer";
import AddTaskForm from "../../features/tasks/components/AddTaskForm";
import TaskList from "../../features/tasks/components/TaskList";
import { Task } from "../../entities/task";

const HomePage: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filter, setFilter] = React.useState<"doing" | "done" | "overdue">("doing");

  const handleAddTask = (taskData: { name: string; description?: string; date: string; link?: string }) => {
    const newTask: Task = {
      id: Date.now(),
      name: taskData.name,
      description: taskData.description,
      date: new Date(taskData.date),
      link: taskData.link,
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCompleteTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: true } : t))
    );
  };

  // Фильтрация
  const now = new Date();
  const filteredTasks = tasks.filter((t) => {
    if (filter === "doing") return !t.done && t.date > now;
    if (filter === "done") return t.done;
    if (filter === "overdue") return !t.done && t.date <= now;
    return true;
  });

  return (
    <div className="min-h-screen w-full p-5 bg-gradient-to-br from-pink-200 to-blue-200 flex flex-col items-center box-border">
      <h1 className="text-4xl text-gray-700 mb-6 text-center font-bold">Pomodoro &amp; Task Manager</h1>
      <div className="flex flex-wrap gap-8 max-w-screen-xl w-full justify-center">
        
        {/* Секция с таймером */}
        <div className="flex-1 min-w-[300px] max-w-[500px] flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Pomodoro Timer</h2>
          <div className="w-full bg-white/80 rounded-xl shadow-md p-5">
            <Timer />
          </div>
        </div>
        
        {/* Секция с задачами */}
        <div className="flex-1 min-w-[300px] max-w-[600px] flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Task Manager</h2>
          <div className="w-full bg-white/80 rounded-xl shadow-md p-5">
            <AddTaskForm onAddTask={handleAddTask} />
            
            <div className="flex gap-3 my-5 justify-center">
              <button
                onClick={() => setFilter("doing")}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  filter === "doing" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                To-do
              </button>
              <button
                onClick={() => setFilter("done")}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  filter === "done" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Done
              </button>
              <button
                onClick={() => setFilter("overdue")}
                className={`px-4 py-2 text-lg rounded-md transition ${
                  filter === "overdue" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Overdue
              </button>
            </div>

            <TaskList
              tasks={filteredTasks}
              filter={filter}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
