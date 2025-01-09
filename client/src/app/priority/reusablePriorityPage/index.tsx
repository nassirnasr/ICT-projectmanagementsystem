'use client';
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import ModalNewTask from '@/components/ModalNewTask';
import TaskCard from '@/components/TaskCard';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { Priority, Task, useGetTaskByUserQuery } from '@/state/api'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react'

type Props = {
    priority: Priority
}

// Define the colors for the statuses
const statusColor: Record<string, string> = {
    "To Do": "#D97706", // Amber
    "Work In Progress": "#6B7280", // Gray
    "Under Review": "#059669", // Green
    Completed: "#2563EB", // Blue
  };

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span
        className="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
        style={{
          backgroundColor: `${statusColor[params.value] || "#E5E7EB"}`, // Default Gray
          color: "#FFFFFF", // White text for better contrast
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({priority}: Props) => {
    const [view, setView] = useState("list");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    const userId = 1;
    const {data: tasks, isLoading, isError: isTaskError} = useGetTaskByUserQuery(userId || 0, {
        skip:userId === null
    })

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const filteredTasks = tasks?.filter((task: Task) => task.priority === priority);

    if (isTaskError || !tasks) return <div>Error fetching tasks</div>
  return (
    <div className='m-5 p-4 '>
        <ModalNewTask 
            isOpen={isModalNewTaskOpen}
            onClose={() => setIsModalNewTaskOpen(false)}/>

        <Header name='Priority Page' 
            buttonComponent={
                <button
                    className='mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
                    onClick={() => setIsModalNewTaskOpen(true)}>
                        Add Task
                    </button>
            }/>   
            <div className='mb-4 flex justify-start'>
                <button className={`px-4 py-2 mr-2 ${
                    view === "list" ? "bg-gray-300 " : "bg-white"
                } rounded-l`}
                    onClick={() => setView("list")}>
                        List
                </button>
                <button className={`px-4 py-2 ${
                    view === "table" ? "bg-gray-300 " : "bg-white"
                } rounded-l`}
                    onClick={() => setView("table")}>
                        Table
                </button>
                </div> 
                {isLoading 
                    ? (<div>Loading tasks...</div>)
                    : view === "list" 
                    ? <div className='grid grid-cols-1 gap-4'>
                        {filteredTasks?.map((task: Task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div> : (
                        view === "table" && filteredTasks && (
                            <div className='w-full'>
                                <DataGrid
                                    rows={filteredTasks}
                                    columns={columns}
                                    checkboxSelection
                                    getRowId={(row) => row.id}
                                    className={dataGridClassNames}
                                    sx={dataGridSxStyles(isDarkMode)}
                                    />
                            </div>
                        )
                    )}
    </div>
  )
}

export default ReusablePriorityPage