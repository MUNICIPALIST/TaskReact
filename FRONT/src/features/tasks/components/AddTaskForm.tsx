// src/features/tasks/components/AddTaskForm.tsx
import React, { FC, useState } from "react";

interface AddTaskFormProps {
  onAddTask: (task: {
    name: string;
    description?: string;
    date: string;
    link?: string;
  }) => void;
}

const AddTaskForm: FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskLink, setTaskLink] = useState("");

  const handleSubmit = () => {
    if (!taskName || !taskDate) {
      alert("Please enter a task name and date!");
      return;
    }
    onAddTask({
      name: taskName,
      description: taskDescription,
      date: taskDate,
      link: taskLink,
    });
    setTaskName("");
    setTaskDate("");
    setTaskDescription("");
    setTaskLink("");
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="border rounded p-2"
      />
      <textarea
        placeholder="Description of Tasks"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="datetime-local"
        value={taskDate}
        onChange={(e) => setTaskDate(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="url"
        placeholder="Link"
        value={taskLink}
        onChange={(e) => setTaskLink(e.target.value)}
        className="border rounded p-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 self-start"
      >
        Add Task
      </button>
    </div>
  );
};

export default AddTaskForm;
