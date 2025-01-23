"use client"
import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StoreProvider, { useAppSelector } from './redux';


const DashboardLayout = ({children} : {children: React.ReactNode}) => {
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );

    const isDarkMode = useAppSelector(
        (state) => state.global.isDarkMode
    );

    useEffect(()=> {
        if(isDarkMode){
            document.documentElement.classList.add("dark");//set and utilize class dark to root element
        }else{
            document.documentElement.classList.remove("dark");
        }
    })


    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg">
            {/* SIDE BAR */}
            <Sidebar />
            <main className={`flex w-full flex-col transition-all duration-300 ${
                isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
            }`}>
                {/* NAVBAR */}
                <Navbar />
                {/* CHILDREN */}
                <div className="p-4">{children}</div>
            </main>
        </div>
    );
    
}

const dashboardWrapper = ({children} : {children: React.ReactNode}) => {
    return(
        <StoreProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </StoreProvider>
    )
}

export default dashboardWrapper
