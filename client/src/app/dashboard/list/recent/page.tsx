"use client";
import { Clock } from "lucide-react";

interface RecentItem {
  id: string;
  title: string;
  type: 'task' | 'project' | 'page';
  timestamp: string;
  href: string;
}

const RecentPage = () => {
  // This would eventually come from an API or Redux store
  const recentItems: RecentItem[] = [
    {
      id: "1",
      title: "Project Alpha Setup",
      type: "project",
      timestamp: "2024-03-20T10:30:00Z",
      href: "/projects/alpha"
    },
    {
      id: "2",
      title: "Task #123 - Implementation",
      type: "task",
      timestamp: "2024-03-20T09:15:00Z",
      href: "/tasks/123"
    },
    {
      id: "3",
      title: "Timeline View",
      type: "page",
      timestamp: "2024-03-20T08:45:00Z",
      href: "/timeline"
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center gap-3">
        <Clock className="h-6 w-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h1>
      </div>

      <div className="space-y-4">
        {recentItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-dark-secondary dark:hover:bg-dark-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {item.type}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentPage; 