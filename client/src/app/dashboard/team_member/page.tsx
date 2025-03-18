'use client'
import { Priority, Status, Task, useGetTaskByUserQuery, useUpdateTaskStatusMutation } from '@/state/api'
import { useAppSelector } from '../../redux';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import Header from '@/components/Header';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@clerk/nextjs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import LoadingPage from '../Loading';

const getStatusIcon = (status: Status) => {
    const iconMap: Record<Status, JSX.Element> = {
      [Status.ToDo]: <ListTodo className="w-4 h-4" />,
      [Status.WorkInProgress]: <Clock className="w-4 h-4" />,
      [Status.UnderReview]: <AlertCircle className="w-4 h-4" />,
      [Status.Completed]: <CheckCircle className="w-4 h-4" />
    }
    return iconMap[status]
  }

  const taskColumns: GridColDef<Task>[] = [
  { field: "title", headerName: "Title", width: 200 },
  { 
    field: "status", 
    headerName: "Status", 
    width: 150,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        {getStatusIcon(params.row.status as Status)}
        {params.row.status}
      </div>
    )
  },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <StatusDropdown task={params.row} />
    )
  }
];

const StatusDropdown = ({ task }: { task: Task }) => {
  const [updateStatus] = useUpdateTaskStatusMutation();
  
  const handleStatusChange = async (newStatus: Status) => {
    try {
      await updateStatus({
        taskId: task.id,
        status: newStatus
      }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(Status).map(status => (
          <DropdownMenuItem 
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={task.status === status}
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TeamMemberPage = () => {
  const { userId } = useAuth();
  const { data: tasks, isLoading, isError } = useGetTaskByUserQuery(Number(userId));
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <LoadingPage/>;
  if (isError) return <div className="p-8 text-red-500">Error loading tasks</div>;

  const statusCount = tasks?.reduce((acc: Record<string, number>, task: Task) => {
    acc[task.status || Status.ToDo] = (acc[task.status || Status.ToDo] || 0) + 1;
    return acc;
  }, {});

  const taskStatusData = Object.entries(statusCount || {}).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="container p-8">
      <Header name="My Tasks Dashboard" />
      
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={tasks?.length || 0}
          icon={<ListTodo className="text-blue-500" />}
        />
        <StatCard
          title="In Progress"
          value={statusCount?.[Status.WorkInProgress] || 0}
          icon={<Clock className="text-yellow-500" />}
        />
        <StatCard
          title="Completed"
          value={statusCount?.[Status.Completed] || 0}
          icon={<CheckCircle className="text-green-500" />}
        />
        <StatCard
          title="Overdue"
          value={tasks?.filter(t => new Date(t.dueDate || '') < new Date()).length || 0}
          icon={<AlertCircle className="text-red-500" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold">Task Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {taskStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded-lg shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold">My Tasks</h3>
          <div className="h-[400px]">
            <DataGrid
              rows={tasks || []}
              columns={taskColumns}
              loading={isLoading}
              getRowId={(row) => row.id}
              sx={{
                '& .MuiDataGrid-cell': {
                  border: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  border: 'none',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;