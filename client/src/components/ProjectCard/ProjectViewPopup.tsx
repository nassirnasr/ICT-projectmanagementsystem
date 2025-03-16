import React, { useRef, useState } from 'react';
import { Task } from '@/state/api';
import { format } from 'date-fns';

type Props = {
  task: Task;
  onClose: () => void;
};

const statusColor: Record<string, string> = {
  "To Do": "#D97706",
  "Work In Progress": "#6B7280",
  "Under Review": "#059669",
  Completed: "#2563EB",
};

const ProjectViewPopup = ({ task, onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const status = task.status || "Unknown";
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsLoading(true);
      // Add your actual upload logic here
      console.log('Files to upload:', files);
      alert('Upload functionality not implemented yet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-lg relative max-w-2xl w-full mx-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
          accept="*"
        />
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h2>
        
        <div className="space-y-4 text-sm">
          <p>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Description:</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {task.description || 'No description provided'}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Status:</span>{' '}
            <span className="font-semibold" style={{ color: statusColor[status] || '#6B7280' }}>
              {status}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Priority:</span>{' '}
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
              task.priority === 'Urgent' ? 'bg-red-200 text-red-700' :
              task.priority === 'High' ? 'bg-yellow-200 text-yellow-700' :
              task.priority === 'Medium' ? 'bg-green-200 text-green-700' :
              task.priority === 'Low' ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-700'
            }`}>
              {task.priority}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Due Date:</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {task.dueDate ? format(new Date(task.dueDate), 'PP') : 'Not set'}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Assignee:</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {task.assignee?.username || 'Unassigned'}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <button 
            onClick={handleUploadClick}
            disabled={isLoading}
            className="mr-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
          >
            {isLoading ? 'Uploading...' : 'Upload File'}
          </button>
          <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">Review</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewPopup; 