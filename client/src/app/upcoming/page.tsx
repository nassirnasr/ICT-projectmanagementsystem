"use client";
import { CalendarClock } from "lucide-react";

interface UpcomingItem {
  id: string;
  title: string;
  type: 'task' | 'meeting' | 'deadline';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}

const UpcomingPage = () => {
  // This would eventually come from an API or Redux store
  const upcomingItems: UpcomingItem[] = [
    {
      id: "1",
      title: "Project Review Meeting",
      type: "meeting",
      dueDate: "2024-03-25T14:00:00Z",
      priority: "high",
      description: "Quarterly review of ongoing projects"
    },
    {
      id: "2",
      title: "Documentation Update",
      type: "task",
      dueDate: "2024-03-26T17:00:00Z",
      priority: "medium",
      description: "Update API documentation for new features"
    },
    {
      id: "3",
      title: "Phase 1 Completion",
      type: "deadline",
      dueDate: "2024-03-28T23:59:59Z",
      priority: "high"
    },
  ];

  const getPriorityColor = (priority: UpcomingItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getTypeIcon = (type: UpcomingItem['type']) => {
    switch (type) {
      case 'meeting':
        return '🤝';
      case 'task':
        return '📋';
      case 'deadline':
        return '⏰';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-3">
        <CalendarClock className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Upcoming</h1>
      </div>

      <div className="space-y-4">
        {upcomingItems.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-secondary"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(item.type)}</span>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                  <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Due: {new Date(item.dueDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPage; 