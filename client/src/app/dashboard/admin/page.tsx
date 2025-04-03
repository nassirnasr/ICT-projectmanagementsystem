'use client'
import { Priority, Project, Task, useGetProjectsQuery, useGetTasksQuery, useGetTeamsQuery, useGetUsersQuery } from '@/state/api'
import React from 'react'
import { useAppSelector } from '../../redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Header from '@/components/Header';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { Eye, View, Users, Briefcase, ListTodo, Users2 } from 'lucide-react';
import LoadingPage from '../Loading';


const handleView = () => {
    console.log("Viewing row:"); // Replace this with your logic
  };

const COLORS = ["#0088FE" , "00C49F", "#FFBB28" , "#FF8042"];

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
}

const StatCard = ({ title, value, icon, change }: StatCardProps) => (
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

const HomePage = () => {
  const {
    data: tasks, 
    isLoading: taskLoading, 
    isError: taskError
  } = useGetTasksQuery({});

    const {data: projects,isLoading: isProjectsLoading} = useGetProjectsQuery();
    const {data: users , isLoading: isUserLoading } = useGetUsersQuery();
     const {data: teams , isLoading: isTeamLoading , isError} = useGetTeamsQuery();

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const taskColumns: GridColDef<Task>[] = [
        { 
          field: 'id', 
          headerName: 'S/N', 
          width: 70,
          renderCell: (params) => (tasks || []).findIndex((t: Task) => t.id === params.row.id) + 1
        },
        {field: "title", headerName: "Title", width: 200},
        {field: "status", headerName: "Status", width: 150},
        {field: "priority", headerName: "Priority", width: 150},
        {field: "dueDate", headerName: "Due Date", width: 150},
    ];

    if (taskLoading || isProjectsLoading || isUserLoading || isTeamLoading) return <LoadingPage/>;
    if (taskError || !tasks || !projects || !users || !teams) return <div>Error fetching data</div>

            //priority count
    const priorityCount = tasks.reduce(
        (acc: Record<string, number>, task: Task) =>{
            const {priority} = task;
            acc[priority as Priority] = (acc[priority as Priority] || 0) +1;
            return acc;
        },
        {},//empty object
    );

    const taskDistribution = Object.keys(priorityCount).map((key) => ({
        name: key,
        count: priorityCount[key],
    }));

        //status count
        const statusCount = projects.reduce(
            (acc: Record<string, number>, project: Project) =>{
                const status = project.endDate ? "Completed" : "Active";
                acc[status] = (acc[status] || 0) +1;
                return acc;
            },
            {},//empty object
        );

        const projectStatus = Object.keys(statusCount).map((key) => ({
            name: key,
            count: statusCount[key],
        }));

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


  return (
    <div className='container h-full w-[100%] bg-gray-100 bg-transparent p-8'>
        <Header name="Project Management Dashboard"/>
        
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={projects?.length || 0}
            icon={<Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            change={12}
          />
          <StatCard
            title="Active Tasks"
            value={tasks?.filter(task => task.status === "Work In Progress" || task.status === "To Do").length || 0}
            icon={<ListTodo className="h-6 w-6 text-green-600 dark:text-green-400" />}
            change={8}
          />
          <StatCard
            title="Users"
            value={users?.length || 0} 
            icon={<Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            change={-3}
          />
          <StatCard
            title="Teams"
            value={teams?.length || 0} 
            icon={<Users2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
            change={25}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 '>

            {/* TASK PRIORITY DISTRIBUSTION */}
            <div className='rounded-lg shadow bg-white dark:bg-dark-secondary p-4'>
                <h3 className='mb-4 text-lg font-semibold dark:text-white'>
                    Task Priority Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={taskDistribution}>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={chartColors.barGrid}/>
                        <XAxis dataKey="name" stroke={chartColors.text} />
                        <YAxis stroke={chartColors.text} />
                        <Tooltip contentStyle={{
                            width: "min-content",
                            height: "min-content",
                        }} />
                        <Legend/>
                        <Bar 
                            dataKey="count"
                            fill={chartColors.bar}  />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* PROJECT STATUS */}
            <div className='rounded-lg shadow bg-white dark:bg-dark-secondary p-4'>
                <h3 className='mb-4 text-lg font-semibold dark:text-white'>
                    Project Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart >
                        <Pie 
                            dataKey="count" 
                            data={projectStatus}
                            fill='#82ca9d'
                            label>
                                {projectStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                        <Tooltip />
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className='rounded-lg shadow bg-white dark:bg-dark-secondary p-4 md:col-span-2'>
                <h3 className='mb-4 text-lg font-semibold dark:text-white'>
                    All Tasks
                </h3>
                <div style={{height: 400, width:"100%"}}>
                    <DataGrid 
                        rows={tasks}
                        columns={taskColumns}
                        loading={taskLoading}
                        getRowClassName={()=> "data-grid-row"}
                        getCellClassName={()=> "data-grid-cell"}
                        className={dataGridClassNames}
                        sx={dataGridSxStyles(isDarkMode)}/>
                </div>
                </div>
        </div>
    </div>
  )
}

export default HomePage