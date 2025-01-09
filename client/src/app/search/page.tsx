'use client'
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import UserCard from '@/components/UserCard';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'

const Search = () =>{
    const [searchTerm, setSearchTerm] = useState("");
    const { 
        data: searchResults, 
        isLoading , 
        isError} = useSearchQuery(searchTerm, {     //API request
        skip: searchTerm.length < 3   //start request when atleast 3 terms entered
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value)
    },500 //search in 500 milsec
    ,
);
    
    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);
  return (
    <div className='p-8 '>
        <Header name='Search' />
        <div >
            <input 
                type="text" 
                placeholder='Search...' 
                className='w-1/3 rounded p-3 shadow border-none dark:text-white dark:bg-dark-tertiary focus:outline-none' 
                onChange={handleSearch} />
        </div>

        <div className='p-5'>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error occured while fetching searching results</p>}
            {!isLoading && !isError && searchResults && (
                <div>
                            {/* TASKS */}
                    {searchResults.tasks && searchResults.tasks?.length > 0 && (
                        <h2 className='font-semibold dark:text-white p-4 text-lg'>Tasks</h2>
                    )}
                    {searchResults.tasks?.map((task) => (
                        <TaskCard key={task.id} task={task}/>
                    ))}
                            {/* PROJECT */}
                    {searchResults.projects && searchResults.projects?.length > 0 && (
                        <h2 className='font-semibold dark:text-white p-4 text-lg'>Projects</h2>
                    )}
                    {searchResults.projects?.map((project) => (
                        <ProjectCard key={project.id} project={project}/>
                    ))}

                            {/* USERS */}
                    {searchResults.users && searchResults.users?.length > 0 && (
                        <h2 className='font-semibold dark:text-white p-4 text-lg'>Users</h2>
                    )}
                    {searchResults.users?.map((user) => (
                        <UserCard key={user.userId} user={user}/>
                    ))}        
                </div>
            )}
        </div>
    </div>
  )
}

export default Search