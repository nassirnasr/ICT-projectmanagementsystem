'use client'
import { Priority, Status, Task, useGetTaskByUserQuery, useUpdateTaskStatusMutation, useGetUsersQuery } from '@/state/api'
import { useAppSelector } from '../../redux';
import { DataGrid, GridColDef, GridRowParams,} from '@mui/x-data-grid';
import Header from '@/components/Header';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@clerk/nextjs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, CheckCircle, Clock, AlertCircle, ListTodo, GitBranch, GitPullRequest, Activity, ClipboardCheck } from 'lucide-react';
import LoadingPage from '../Loading';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const getStatusIcon = (status: Status) => {
    const iconMap: Record<Status, JSX.Element> = {
      [Status.ToDo]: <ListTodo className="w-4 h-4" />,
      [Status.WorkInProgress]: <Clock className="w-4 h-4" />,
      [Status.UnderReview]: <AlertCircle className="w-4 h-4" />,
      [Status.Completed]: <CheckCircle className="w-4 h-4" />
    }
    return iconMap[status]
  }

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
  const { userId: clerkUserId } = useAuth();
  const { data: users } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  // Find the user and get their database ID
  const currentUser = users?.find(user => user.userId === clerkUserId);
  const databaseUserId = currentUser?.userId;
  
  console.log('Clerk User ID:', clerkUserId);
  console.log('Current User:', currentUser);
  console.log('Database User ID:', databaseUserId);

  // Only fetch tasks if we have a valid user ID
  const { data: tasks, isLoading, isError } = useGetTaskByUserQuery(
    databaseUserId || '', 
    {
      skip: !databaseUserId // Skip the query if we don't have a valid user ID
    }
  );

  const taskColumns: GridColDef<Task>[] = [
    { 
      field: 'id', 
      headerName: 'S/N', 
      width: 70,
      renderCell: (params) => (tasks || []).findIndex(t => t.id === params.row.id) + 1
    },
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

  // Only show loading state if we're still loading users or tasks
  if (isLoading || !users) return <LoadingPage />;
  
  if (isError) return (
    <div className="p-8 text-center">
      <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Tasks</div>
      <p className="text-gray-600 dark:text-gray-400">
        Could not load your tasks. Please try again later.
      </p>
    </div>
  );

  if (!databaseUserId) return (
    <div className="p-8 text-center">
      <div className="text-red-500 text-xl mb-4">⚠️ User Not Found</div>
      <p className="text-gray-600 dark:text-gray-400">
        Your user account could not be found. Please contact support.
      </p>
    </div>
  );

  if (!tasks || tasks.length === 0) return (
    <div className="p-8 text-center">
      <div className="text-2xl mb-4">🎉 No Tasks Assigned!</div>
      <p className="text-gray-600 dark:text-gray-400">
        You currently have no assigned tasks.
      </p>
    </div>
  );

  const chartColors = isDarkMode
        ? {
            bar: "#8884d8",
            barGrid: "#303030",
            pieFill: "#4A90E2",
            text: "#FFFFFF"
        } : {
            bar: "#8884d8",
            barGrid: "#E0E0E0",
            pieFill: "#82ca9d",
            text: "#000000"
        };

  const statusCount = tasks.reduce((acc: Record<string, number>, task: Task) => {
    acc[task.status || Status.ToDo] = (acc[task.status || Status.ToDo] || 0) + 1;
    return acc;
  }, {});

  const taskStatusData = Object.entries(statusCount).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="container p-8">
      <Header name="My Tasks Dashboard" />
      
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<ListTodo className="text-blue-500" />}
        />
        <StatCard
          title="To Do"
          value={statusCount[Status.ToDo] || 0}
          icon={<Clock className="text-red-500" />}
        />
        <StatCard
          title="On Process"
          value={(statusCount[Status.UnderReview] || 0) + (statusCount[Status.WorkInProgress] || 0)}
          icon={<div className="flex gap-1"><Activity className="text-blue-500" /><ClipboardCheck className="text-purple-500" /></div>}
        />
        <StatCard
          title="Completed"
          value={statusCount[Status.Completed] || 0}
          icon={<CheckCircle className="text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Task Status Distribution</h3>
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
        {taskStatusData.map((entry) => {
          // Define colors based on status names
          const statusColorMap: Record<string, string> = {
            [Status.Completed]: '#22C55E', 
            [Status.ToDo]: '#EF4444',      
            [Status.WorkInProgress]: '#EAB308', 
            [Status.UnderReview]: '#8B5CF6'    
          };
          
          return (
            <Cell 
              key={`cell-${entry.name}`} 
              fill={statusColorMap[entry.name] || '#6B7280'} 
            />
          );
        })}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4  bg-white rounded-lg shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">My Tasks</h3>
          <div className="h-[400px]">
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              loading={isLoading}
              getRowId={(row) => row.id}
              getRowClassName={()=> "data-grid-row"}
              getCellClassName={()=> "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberPage;