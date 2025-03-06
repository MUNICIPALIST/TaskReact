// src/features/tasks/components/TaskCard.tsx
import React, { FC } from "react";
import { Task } from "../../../entities/task";

interface TaskCardProps {
  task: Task;
  filter: "doing" | "done" | "overdue";
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskCard: FC<TaskCardProps> = ({ task, filter, onComplete, onDelete }) => {
  const isOverdue = !task.done && filter === "overdue";

  return (
    <div
      className={`p-4 rounded shadow mb-3 transition ${
        isOverdue ? "bg-red-50 border border-red-200" : "bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
      <p className="text-gray-600 mb-1">
        {task.description || "No description"}
      </p>
      <p className="text-sm text-gray-500">
        {task.date.toLocaleString()}
      </p>
      {task.link && (
        <p className="mt-1">
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Source Link
          </a>
        </p>
      )}

      <div className="mt-3 flex gap-2">
        {!task.done && (
          <button
            onClick={() => onComplete(task.id)}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Done
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
