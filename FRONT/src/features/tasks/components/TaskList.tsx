// src/features/tasks/components/TaskList.tsx
import React, { FC } from "react";
import { Task } from "../../../entities/task";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  filter: "doing" | "done" | "overdue";
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, filter, onComplete, onDelete }) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks found</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          filter={filter}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
