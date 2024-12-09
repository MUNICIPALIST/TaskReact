import React, { useState, useEffect } from "react";

// Функция для форматирования оставшегося времени в HH:MM:SS
const formatRemainingTime = (date) => {
  const now = new Date();
  const difference = date - now;

  if (difference <= 0) return "00:00:00";

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [filter, setFilter] = useState("doing"); // Фильтр для отображения задач

  // Загружаем задачи из localStorage при запуске
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Сохраняем задачи в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Добавление новой задачи
  const handleAddTask = () => {
    if (!taskName || !taskDate) {
      alert("Введите название и дату для задачи!");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      date: new Date(taskDate),
      link: taskLink,
      done: false, // Указывает, выполнена ли задача
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDate("");
    setTaskDescription("");
    setTaskLink("");
  };

  // Удаление задачи
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Завершение задачи
  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: true } : task
      )
    );
  };

  // Фильтрация задач
  const now = new Date();
  const filteredTasks = tasks.filter((task) => {
    if (filter === "doing") return !task.done && task.date > now;
    if (filter === "done") return task.done;
    if (filter === "overdue") return !task.done && task.date <= now; // Просроченные задачи
    return true;
  });

  // Эффект для обновления оставшегося времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prevTasks) => [...prevTasks]);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Градиентная анимация */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
      <div style={styles.container}>
        <h1 style={styles.title}>Task Timer App</h1>

        {/* Форма для добавления задачи */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Название задачи"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Описание задачи"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="datetime-local"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            style={styles.input}
          />
          <input
            type="url"
            placeholder="Ссылка на источник"
            value={taskLink}
            onChange={(e) => setTaskLink(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddTask} style={styles.button}>
            Добавить задачу
          </button>
        </div>

        {/* Фильтры */}
        <div style={styles.filterContainer}>
          <button
            onClick={() => setFilter("doing")}
            style={filter === "doing" ? styles.activeFilter : styles.filterButton}
          >
            Делается
          </button>
          <button
            onClick={() => setFilter("done")}
            style={filter === "done" ? styles.activeFilter : styles.filterButton}
          >
            Сделано
          </button>
          <button
            onClick={() => setFilter("overdue")}
            style={filter === "overdue" ? styles.activeFilter : styles.filterButton}
          >
            Просрочено
          </button>
        </div>

        {/* Список задач */}
        <div style={styles.taskList}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                ...styles.taskCard,
                backgroundColor:
                  filter === "overdue" && !task.done ? "#ffe6e6" : "#f9f9f9",
              }}
            >
              <h2 style={styles.taskName}>{task.name}</h2>
              <p style={styles.taskDescription}>
                <strong>Описание:</strong> {task.description}
              </p>
              {task.link && (
                <p style={styles.taskLink}>
                  <strong>Источник:</strong>{" "}
                  <a href={task.link} target="_blank" rel="noopener noreferrer">
                    {task.link}
                  </a>
                </p>
              )}
              <p style={styles.taskTime}>
                Оставшееся время: {formatRemainingTime(task.date)}
              </p>
              {!task.done && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  style={styles.completeButton}
                >
                  Завершено
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={styles.deleteButton}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #5f72be, #29c1cb)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#fff",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "300px",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "300px",
    height: "60px",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  filterButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  activeFilter: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  taskCard: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "5px",
    width: "400px",
    textAlign: "left",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  taskName: {
    fontSize: "1.2rem",
    margin: "0 0 10px 0",
  },
  taskDescription: {
    fontSize: "0.9rem",
    color: "#555",
  },
  taskLink: {
    fontSize: "0.9rem",
    color: "#007BFF",
  },
  taskTime: {
    fontSize: "1rem",
    color: "#555",
  },
  completeButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "0.9rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "0.9rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;