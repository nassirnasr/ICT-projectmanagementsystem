import { Task } from '@/state/api';
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

type Props = {
  task: Task;
};

const statusColor: Record<string, string> = {
  "To Do": "#D97706",
  "Work In Progress": "#6B7280",
  "Under Review": "#059669",
  Completed: "#2563EB",
};

const TaskCard = ({ task }: Props) => {
  const status = task.status || "Unknown";

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-secondary dark:text-white">
      {/* Attachments */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Attachments:</h3>
          <div className="flex flex-wrap gap-4">
            {task.attachments.map((attachment, index) => (
              <Image
                key={index}
                src={`/${attachment.fileUrl}`}
                alt={attachment.fileName}
                width={400}
                height={200}
                className="rounded-md shadow-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Task Details */}
      <div className="space-y-4 text-sm">
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">ID:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{task.id}</span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Title:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{task.title}</span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Description:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {task.description || 'No description provided'}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Status:</span>{' '}
          <span
            className="font-semibold"
            style={{ color: statusColor[status] || '#6B7280' }}
          >
            {status}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Priority:</span>{' '}
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              task.priority === 'Urgent'
                ? 'bg-red-200 text-red-700'
                : task.priority === 'High'
                ? 'bg-yellow-200 text-yellow-700'
                : task.priority === 'Medium'
                ? 'bg-green-200 text-green-700'
                : task.priority === 'Low'
                ? 'bg-blue-200 text-blue-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {task.priority}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Tags:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{task.tags}</span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Start Date:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {task.startDate ? format(new Date(task.startDate), 'P') : 'Not set'}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Due Date:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {task.dueDate ? format(new Date(task.dueDate), 'P') : 'Not set'}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Author:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {task.author ? task.author.username : 'Unknown'}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600 dark:text-neutral-400">Assignee:</span>{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {task.assignee ? task.assignee.username : 'Unassigned'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TaskCard;
