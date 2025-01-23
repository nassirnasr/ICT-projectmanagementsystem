"use client";

import React, { useState, useRef, useEffect } from 'react';
import {Menu, Moon, Search, Settings, Sun, User} from "lucide-react";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';
import TaskCard from '@/components/TaskCard';
import ProjectCard from '@/components/ProjectCard';
import UserCard from '@/components/UserCard';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { 
    data: searchResults, 
    isLoading, 
    isError 
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <div ref={searchRef} className='relative flex h-min w-[280px]'>
      <Search className='absolute left-3 top-1/2 mr-2 h-4 w-4 -translate-y-1/2 transform text-slate-400 dark:text-slate-500'/>
      <input 
        className='w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 pl-10 text-sm text-slate-600 placeholder-slate-400 transition-colors focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-700/50' 
        type='search'
        placeholder='Search for tasks, projects, or users...'
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
      />
      
      {/* Search Results Dropdown */}
      {isOpen && searchTerm.length >= 3 && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-[80vh] w-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {isLoading && (
            <div className='flex justify-center items-center py-4'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
            </div>
          )}

          {isError && (
            <div className='px-4 py-2 text-sm text-red-500'>
              Error occurred while searching
            </div>
          )}

          {!isLoading && !isError && searchResults && (
            <div className='space-y-2 p-2'>
              {/* Tasks Section */}
              {searchResults.tasks && searchResults.tasks.length > 0 && (
                <div>
                  <h3 className='px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                    Tasks ({searchResults.tasks.length})
                  </h3>
                  <div className='space-y-1'>
                    {searchResults.tasks.map((task) => (
                      <div key={task.id} onClick={() => setIsOpen(false)}>
                        <TaskCard task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {searchResults.projects && searchResults.projects.length > 0 && (
                <div>
                  <h3 className='px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                    Projects ({searchResults.projects.length})
                  </h3>
                  <div className='space-y-1'>
                    {searchResults.projects.map((project) => (
                      <div key={project.id} onClick={() => setIsOpen(false)}>
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Section */}
              {searchResults.users && searchResults.users.length > 0 && (
                <div>
                  <h3 className='px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                    Users ({searchResults.users.length})
                  </h3>
                  <div className='space-y-1'>
                    {searchResults.users.map((user) => (
                      <div key={user.userId} onClick={() => setIsOpen(false)}>
                        <UserCard user={user} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {!searchResults.tasks?.length && 
               !searchResults.projects?.length && 
               !searchResults.users?.length && (
                <div className='px-4 py-2 text-sm text-slate-500 dark:text-slate-400'>
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
);

const isDarkMode = useAppSelector(
    (state) => state.global.isDarkMode
);

  return (
    <div className='flex items-center justify-between bg-white px-6 py-4 dark:bg-slate-900 sticky top-0 border-b border-slate-200 dark:border-slate-800 z-50'>
      {/*Search Bar */}
      <div className='flex items-center gap-6'>
        {!isSidebarCollapsed ? null : (
          <button 
            onClick={()=> dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className='h-6 w-6 text-slate-600 dark:text-slate-300'/>
          </button>
        )}
        <SearchBar />
      </div>

      {/* ICONS */}
      <div className='flex items-center gap-2'>
        <button 
          onClick={()=> dispatch(setIsDarkMode(!isDarkMode))}
          className={`rounded-lg p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800`}
        >
          {isDarkMode 
            ? <Sun className='h-5 w-5 text-slate-600 dark:text-slate-300'/>
            : <Moon className='h-5 w-5 text-slate-600 dark:text-slate-300'/>
          }
        </button>
        <Link
          href="/settings"
          className={`rounded-lg p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800`}
        >
          <Settings className='h-5 w-5 text-slate-600 dark:text-slate-300'/>
        </Link>
        <Link
          href="/users"
          className={`flex items-center gap-2 rounded-lg p-2.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800`}
        >
          <User className='h-5 w-5 text-slate-600 dark:text-slate-300'/>
          <span className='font-medium text-slate-700 dark:text-slate-200'>Admin</span>
        </Link>
        <div className='ml-4 mr-2 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 md:inline-block'></div>
      </div>
    </div>
  )
}

export default Navbar