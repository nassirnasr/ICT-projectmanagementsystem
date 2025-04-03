'use client'
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { 
        data: searchResults, 
        isLoading, 
        isError 
    } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value)
        },
        500
    );
    
    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);

    return (
        <div className='max-w-7xl mx-auto p-8'>
            <Header name='Search Tasks' />
            
            {/* Search Input */}
            <div className='relative w-full max-w-2xl mx-auto mt-6'>
                <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input 
                    type="text" 
                    placeholder='Search for tasks...' 
                    className='w-full rounded-lg p-4 pl-12 shadow-md border border-gray-200 
                             dark:border-gray-700 dark:text-white dark:bg-dark-tertiary 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
                    onChange={handleSearch}
                />
            </div>

            {/* Results Section */}
            <div className='mt-8'>
                {isLoading && (
                    <div className='flex justify-center items-center py-12'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                    </div>
                )}

                {isError && (
                    <div className='text-center py-12 text-red-500 dark:text-red-400'>
                        <p>Error occurred while fetching search results</p>
                    </div>
                )}

                {!isLoading && !isError && searchResults && (
                    <div className='space-y-8'>
                        {/* Tasks Section */}
                        {searchResults.tasks && searchResults.tasks.length > 0 ? (
                            <div>
                                <h2 className='font-semibold text-xl dark:text-white mb-4 flex items-center gap-2'>
                                    Tasks
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        ({searchResults.tasks.length})
                                    </span>
                                </h2>
                                <div className='grid gap-4'>
                                    {searchResults.tasks.map((task) => (
                                        <TaskCard key={task.id} task={task}/>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            searchTerm.length >= 3 && (
                                <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                                    <p>No tasks found for "{searchTerm}"</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search