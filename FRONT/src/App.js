import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks"; // Ваш URL бэкенда

// Получение задач с сервера
const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
    return [];
  }
};

// Добавление задачи на сервер
const addTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении задачи:", error);
  }
};

// Удаление задачи
const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
  }
};

// Завершение задачи
const completeTask = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/done`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при завершении задачи:", error);
  }
};

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [filter, setFilter] = useState("doing");

  const handleLogin = () => {
    // Примитивная проверка логина и пароля
    if (loginInput === "admin" && passwordInput === "admin") {
      setIsAuthenticated(true);
    } else {
      alert("Неверный логин или пароль");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const loadTasks = async () => {
        const loadedTasks = await fetchTasks();
        const convertedTasks = loadedTasks.map(task => {
          return { ...task, date: new Date(task.date) };
        });
        setTasks(convertedTasks);
      };
      loadTasks();
    }
  }, [isAuthenticated]);

  const handleAddTask = async () => {
    if (!taskName || !taskDate) {
      alert("Введите название и дату для задачи!");
      return;
    }

    const newTask = {
      name: taskName,
      description: taskDescription,
      date: new Date(taskDate),
      link: taskLink,
      done: false
    };

    const addedTask = await addTask(newTask);
    if (addedTask) {
      addedTask.date = new Date(addedTask.date);
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    }

    setTaskName("");
    setTaskDate("");
    setTaskDescription("");
    setTaskLink("");
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCompleteTask = async (id) => {
    const updatedTask = await completeTask(id);
    if (updatedTask) {
      updatedTask.date = new Date(updatedTask.date);
      setTasks(
        tasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    }
  };

  const now = new Date();
  const filteredTasks = tasks.filter((task) => {
    if (filter === "doing") return !task.done && task.date > now;
    if (filter === "done") return task.done;
    if (filter === "overdue") return !task.done && task.date <= now;
    return true;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAuthenticated) setTasks((prevTasks) => [...prevTasks]);
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Отображаем форму логина, если пользователь не авторизован
    return (
      <div style={styles.loginContainer}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Login"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Sign in</button>
      </div>
    );
  }

  // Если авторизован - основной интерфейс
  return (
    <div>
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
        <h1 style={styles.title}>Banana Tasks</h1>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Description of Tasks"
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
            placeholder="Links"
            value={taskLink}
            onChange={(e) => setTaskLink(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleAddTask} style={styles.button}>
          Add a TASK
          </button>
        </div>

        <div style={styles.filterContainer}>
          <button
            onClick={() => setFilter("doing")}
            style={filter === "doing" ? styles.activeFilter : styles.filterButton}
          >
            To-do
          </button>
          <button
            onClick={() => setFilter("done")}
            style={filter === "done" ? styles.activeFilter : styles.filterButton}
          >
            Done
          </button>
          <button
            onClick={() => setFilter("overdue")}
            style={filter === "overdue" ? styles.activeFilter : styles.filterButton}
          >
            Overdue
          </button>
        </div>

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
                <strong>descriptions:</strong> {task.description}
              </p>
              {task.link && (
                <p style={styles.taskLink}>
                  <strong>Source:</strong>{" "}
                  <a href={task.link} target="_blank" rel="noopener noreferrer">
                    {task.link}
                  </a>
                </p>
              )}

              {!task.done && (
                <p style={styles.taskTime}>
                  Remaining time: {formatRemainingTime(task.date)}
                </p>
              )}

              {!task.done && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  style={styles.completeButton}
                >
                  Done
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const styles = {
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "10px",
    background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
  },
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
    color: "#00000",
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