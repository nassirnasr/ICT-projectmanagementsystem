import React from 'react'
import {Menu, Moon, Search, Settings, Sun, User} from "lucide-react";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
);

const isDarkMode = useAppSelector(
    (state) => state.global.isDarkMode
);

  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 dark:bg-black dark:px-4 dark:py-3'>
      {/*Search Bar */}
      <div className='flex items-center gap-8'>
        {!isSidebarCollapsed ? null : (
          <button onClick={()=> dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
            <Menu className='h-8 w-8 dark:text-white'/>
          </button>
        )}
        <div className='relative flex h-min w-[200px]'>
          <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white'/>
          <input 
          className='w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:text-white dark:bg-gray-700 dark:placeholder-white' 
          type='search'
          placeholder='Search...'/>
        </div>
      </div>

      {/* ICONS */}
      <div className='flex items-center'>
        <button onClick={()=> dispatch(setIsDarkMode(!isDarkMode))}
          className={isDarkMode 
            ? `rounded p-2 dark:hover:bg-gray-700` 
            : `rounded p-2 hover:bg-gray-100`}
          >
            {isDarkMode 
            ? (
              <Sun className='h-6 w-6 cursor-pointer dark:text-white'/>
            )
          :(
            <Moon className='h-6 w-6 cursor-pointer dark:text-white'/>
          ) }
          </button>
        <Link
        href="/settings"
        className={isDarkMode 
          ? `h-min w-min rounded p-2 dark:hover:bg-gray-700` 
          : `h-min w-min rounded p-2 hover:bg-gray-100`}
       >
          <Settings className='h-6 w-6 cursor-pointer dark:text-white'/>
          
        </Link>
        <Link
        href="/users"
        className={isDarkMode 
          ? `h-min w-min rounded p-2 dark:hover:bg-gray-700 flex flex-row` 
          : `h-min w-min rounded p-2 hover:bg-gray-100 flex flex-row` }
       >
          <User className='h-6 w-6 cursor-pointer dark:text-white'/>
         <span className='font-semibold text-gray-500 dark:text-gray-500 px-3'>Admin</span>
        </Link>
        <div className='ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block '></div>
      </div>
      </div>
  )
}

export default Navbar