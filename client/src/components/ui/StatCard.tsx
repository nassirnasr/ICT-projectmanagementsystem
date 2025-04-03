import { Users, Briefcase, ListTodo, CheckCircle, Clock, AlertCircle, Users2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
}

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const StatCard = ({ title, value, icon, change }: StatCardProps) => (
  <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-3xl font-semibold dark:text-white">{value}</p>
        {change !== undefined && (
          <p className={`mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
      <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
        {icon}
      </div>
    </div>
  </div>
);