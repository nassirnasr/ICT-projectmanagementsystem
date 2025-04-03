"use client" //since we use material ui datagrid
import { useGetTeamsQuery} from '@/state/api'
// import { useGetTeamsQuery, useUpdateTeamMutation } from '@/state/api'
import React, { useState } from 'react'
import { useAppSelector } from '../../../redux';
import Header from '@/components/Header';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const CustomToolbar = () => (
    <GridToolbarContainer className='toolbar flex gap-2'>
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>//can add extra tool bar functionalities
)

const columns: GridColDef[] = [
    {field: "id" ,headerName:"Team ID", width: 100},
    {field: "teamName", headerName:"Team Name", width: 200},
    {field: "productOwnerUsername", headerName:"Product Owner", width: 200},
    {field: "projectManagerUsername", headerName:"Product Manager", width: 200},
    

]

const TeamDetailsPopup = ({ team, onClose, onSave }: { team: any; onClose: () => void; onSave: (updatedTeam: any) => Promise<void> }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(team);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      setIsEditMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-secondary rounded-lg p-6 shadow-lg relative max-w-2xl w-full mx-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
          &times;
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isEditMode ? (
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="bg-transparent border-b border-gray-300 dark:border-gray-600 dark:text-white dark:bg-dark-secondary focus:outline-none focus:border-blue-500"
            />
          ) : (
            team.teamName
          )}
        </h2>
        
        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Team ID:</span>{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{team.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Product Owner:</span>{' '}
            {isEditMode ? (
              <input
                type="text"
                name="productOwnerUsername"
                value={formData.productOwnerUsername}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-300 dark:border-gray-600 dark:text-white dark:bg-dark-secondary focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="font-semibold text-gray-900 dark:text-white">{team.productOwnerUsername}</span>
            )}
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-neutral-400">Project Manager:</span>{' '}
            {isEditMode ? (
              <input
                type="text"
                name="projectManagerUsername"
                value={formData.projectManagerUsername}
                onChange={handleChange}
                className="bg-transparent border-b border-gray-300 dark:border-gray-600 dark:text-white dark:bg-dark-secondary focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="font-semibold text-gray-900 dark:text-white">{team.projectManagerUsername}</span>
            )}
          </div>
          {/* Add more editable fields here as needed */}
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Teams = () =>{
    const {data: teams , isLoading , isError} = useGetTeamsQuery();
    // const [updateTeam] = useUpdateTeamMutation();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

    const handleRowClick = (params: any) => {
      setSelectedTeam(params.row);
    };

    const handleSaveTeam = async (updatedTeam: any) => {
      try {
        // await updateTeam(updatedTeam).unwrap();
        setSelectedTeam(updatedTeam);
      } catch (error) {
        console.error('Failed to update team:', error);
      }
    };

    if(isLoading) return <div>Loading...</div>
    if(isError || !teams) return <div>Error fetching teams</div>
  return (
    <div className='flex w-full flex-col p-8 '>
        <Header name='Teams' />
        <div style={{height:650, width:"100%"}}>
            <DataGrid 
                rows={teams || []}
                columns={columns}
                pagination
                slots={{
                    toolbar:CustomToolbar,  //this enable to use our own design
                }}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
                onRowClick={handleRowClick}
                />
        </div>
        
        {selectedTeam && (
          <TeamDetailsPopup
            team={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onSave={handleSaveTeam}
          />
        )}
    </div>
  )
}

export default Teams