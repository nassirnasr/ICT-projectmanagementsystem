"use client" //since we use material ui datagrid
import { useGetUsersQuery, User, Task } from '@/state/api'
import React, { useState, useRef, useEffect } from 'react'
import { useAppSelector } from '../../../redux';
import Header from '@/components/Header';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Image from 'next/image';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { CircleX, Pen } from 'lucide-react';

type Props = {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => Promise<void>;
};

const UserDetailsPopup = ({ user, onClose, onSave }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePictureUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskAssignment = (task: Task) => {
    setSelectedTasks([...selectedTasks, task]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = {
        ...formData,
        assignedTasks: selectedTasks,
      };
      await onSave(updatedUser);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-lg relative max-w-2xl w-full mx-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
          <CircleX size={22}/>
        </button>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 relative">
            <Image
              src={`/${formData.profilePictureUrl}`}
              alt={formData.username}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {isEditMode && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
                >
                  ✏️
                </button>
              </>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 dark:border-gray-600"
                />
              ) : (
                formData.username
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-300 dark:border-gray-600"
                />
              ) : (
                formData.email
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Task Management</h3>
            <TaskAssignment onAssignTask={handleTaskAssignment} />
            <AssignedTasksList tasks={selectedTasks} />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex justify-between"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomToolbar = () => (
    <GridToolbarContainer className='toolbar flex gap-2'>
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>//can add extra tool bar functionalities
)

const columns: GridColDef[] = [
    {field: "userId" ,headerName:"ID", width: 100},
    {field: "username", headerName:"Username", width: 150},
    {field: "profilePictureUrl", headerName:"Profile Picture", width: 100,
        renderCell: (params) => (
            <div className='flex h-full w-full items-center justify-center'>
                <div className='h-9 w-9'>
                    <Image 
                        src={`/${params.value}`}
                        alt={params.row.username}
                        width={100}
                        height={50}
                        className='h-full rounded-full object-cover'/>
                </div>
            </div>
        )
    },

]

const TaskAssignment = ({ onAssignTask }: { onAssignTask: (task: Task) => void }) => {
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setAvailableTasks(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = availableTasks.filter(task => 
    (task.status === 'To Do' || task.status === 'Work In Progress')
  );

  const handleTaskSelect = (task: Task) => {
    if (!selectedTasks.find(t => t.id === task.id)) {
      setSelectedTasks([...selectedTasks, task]);
      onAssignTask(task);
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleTaskRemove = (taskId: number) => {
    setSelectedTasks(selectedTasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-2 border rounded-lg dark:bg-dark-secondary dark:border-gray-600 dark:text-white flex justify-between items-center"
        >
          <span>Select a task</span>
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskSelect(task)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="dark:text-white">{task.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTasks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 dark:text-white">Selected Tasks</h4>
          {selectedTasks.map(task => (
            <div key={task.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
              <span className="dark:text-white">{task.title}</span>
              <button
                onClick={() => handleTaskRemove(task.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AssignedTasksList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="flex justify-between items-center p-2">
          <span>{task.title}</span>
          <span className="text-sm text-gray-500">{task.status}</span>
        </div>
      ))}
    </div>
  );
};

const Users = () =>{
    const {data: users , isLoading , isError} = useGetUsersQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if(isLoading) return <div>Loading...</div>
    if(isError || !users) return <div>Error fetching users</div>

    const handleRowClick = (params: any) => {
        setSelectedUser(params.row);
    };

    const handleSaveUser = async (updatedUser: User) => {
        // Implement your save logic here
        console.log('Updated user:', updatedUser);
        // After saving, you might want to refetch the users data
    };

    return (
        <div className='flex w-full flex-col p-8 '>
            <Header name='Users' />
            <div style={{height:650, width:"100%"}}>
                <DataGrid 
                    rows={users || []}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                    slots={{
                        toolbar:CustomToolbar,  //this enable to use our own design
                    }}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                    onRowClick={handleRowClick}
                />
            </div>
            
            {selectedUser && (
                <UserDetailsPopup
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    )
}

export default Users