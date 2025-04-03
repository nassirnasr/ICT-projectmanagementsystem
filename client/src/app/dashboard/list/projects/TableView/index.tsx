import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { useGetTasksQuery } from '@/state/api';
import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

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
    // renderCell: (params) => params.value?.author || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
    // renderCell: (params) => params.value.assignee || "Unassigned",
  },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  // Dark mode state
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="Table" 
           buttonComponent={
            <button
                className='flex items-center bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 rounded'
                onClick={() => setIsModalNewTaskOpen(true)}>
                    Add Task
                </button>
        }
        isSmallText />
      </div>
      <DataGrid rows={tasks || []} columns={columns} 
      className={dataGridClassNames}// style from lib/dataDridClassNames
      sx={dataGridSxStyles(isDarkMode)}   // style from lib/dataDridClassNames
      />
    </div>
  );
};

export default TableView;
