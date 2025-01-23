import Header from '@/components/Header';
import { Clock, Filter, Grid3X3, List, PlusSquare, Search, Share, Share2, Table, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'
import ModalNewProject from './ModalNewProject';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';
import TaskCard from '@/components/TaskCard';


type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void
};

const ProjectHeader = ({activeTab,setActiveTab}: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    data: searchResults, 
    isLoading, 
    isError 
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3
  });

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearchOpen(true);
  }, 300);

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setIsFocused(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSearch();
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <div className='px-4 xl:px-6'>
        <ModalNewProject
          isOpen={isModalNewProjectOpen}
           onClose={() => setIsModalNewProjectOpen(false)}
        />
      {/*          MODEL NEW PROJECT           */}
      <div className='pb-6 pt-6 lg:pb-4 lg:pt-8'>
        <Header name='Software Projects Development Hub' 
        buttonComponent={
          <button 
            className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
            onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className='mr-5 h-5 w-5 '/>
              New Project
            </button>
        }/>
      </div>
      {/*      TABS        */}
      <div className='flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center'>
        <div className='flex flex-1 items-center gap-2 md:gap-4'>
          <TabButton
            name='Board'
            icon={<Grid3X3 className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name='List'
            icon={<List className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name='Timeline'
            icon={<Clock className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name='Table'
            icon={<Table className='h-5 w-5'/>}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className='flex items-center gap-2 '>
          <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300'>
            <Filter className='h-5 w-5'/>
          </button>
          <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300'>
            <Share2 className='h-5 w-5'/>
          </button>
          <div ref={searchRef} className='relative'>
            <div className={`flex items-center rounded-md border transition-all duration-150 
              ${isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-dark-secondary'}
              ${isSearchOpen ? 'rounded-b-none' : ''}
              dark:bg-dark-secondary`}
            >
              <Search className={`ml-3 h-4 w-4 transition-colors ${
                isFocused ? 'text-blue-500' : 'text-gray-400 dark:text-neutral-500'
              }`}/>
              <input 
                ref={inputRef}
                type='text' 
                placeholder='Search tasks...' 
                className='w-[240px] py-2 px-3 text-sm bg-transparent focus:outline-none dark:text-white'
                onChange={handleSearch}
                onFocus={() => {
                  setIsFocused(true);
                  setIsSearchOpen(true);
                }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mr-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            
            {/* Search Results Popup */}
            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full w-full max-h-[400px] overflow-y-auto rounded-b-lg border border-t-0 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-dark-secondary z-50">
                {searchTerm.length < 3 ? (
                  <div className='p-4 text-sm text-gray-500 dark:text-gray-400'>
                    Type at least 3 characters to search...
                  </div>
                ) : (
                  <>
                    {isLoading && (
                      <div className='flex items-center gap-2 p-4 text-sm text-gray-500'>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
                        <span>Searching...</span>
                      </div>
                    )}

                    {isError && (
                      <div className='p-4 text-sm text-red-500'>
                        Error occurred while searching
                      </div>
                    )}

                    {!isLoading && !isError && searchResults?.tasks && (
                      <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                        {searchResults.tasks.length > 0 ? (
                          searchResults.tasks.map((task) => (
                            <div 
                              key={task.id} 
                              onClick={() => setIsSearchOpen(false)}
                              className="p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <TaskCard task={task} />
                            </div>
                          ))
                        ) : (
                          <div className='p-4 text-sm text-gray-500 dark:text-gray-400'>
                            No tasks found for "{searchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName:string) => void;
  activeTab: string;
}
const TabButton = ({name, icon ,setActiveTab ,activeTab} : TabButtonProps) =>{
  const isActive = activeTab === name;

  return(
    <button className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4
      ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""}
      `}
      onClick={() => setActiveTab(name)}
      >
        {icon}
        {name}
      </button>
  );
}

export default ProjectHeader