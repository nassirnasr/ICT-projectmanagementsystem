'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import StoreProvider, { useAppSelector } from '../redux'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const routeAccessMap = {
  '/admin(.*)': ['admin'],
  '/team_member(.*)': ['team_member'],
  '/team_leader(.*)': ['team_leader'],
  '/list/projects': ['admin'],
  '/list/priority': ['admin'],
  '/list/recent': ['admin', 'team_leader', 'team_member'],
  '/list/search': ['admin', 'team_leader', 'team_member'],
  '/list/settings': ['admin', 'team_leader', 'team_member'],
  '/list/teams': ['admin'],
  '/list/timeline': ['admin', 'team_leader', 'team_member'],
  '/list/upcoming': ['admin', 'team_leader', 'team_member'],
  '/list/users': ['admin', 'team_leader'],
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoaded, user } = useUser()
  
  // Redux states
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Dark mode handler
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // Authentication and authorization handler
  useEffect(() => {
    if (!isLoaded) return

    // Redirect unauthenticated users
    if (!user) {
      router.push('/sign-in')
      return
    }

    // Get user role from Clerk metadata
    const userRole = user.publicMetadata.role as string | undefined

    // Find matching route permissions
    const allowedRoles = Object.entries(routeAccessMap).find(([route]) => {
      const regex = new RegExp(`^${route.replace('(.*)', '.*')}$`)
      return regex.test(pathname)
    })?.[1]

    // Redirect if no access
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      router.push('/unauthorized')
    }
  }, [isLoaded, user, pathname, router])

  if (!isLoaded) return <div className="flex h-screen w-full items-center justify-center">Loading...</div>

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg">
      {/* Sidebar */}
      <Sidebar />

      <main className={`flex w-full flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
      }`}>
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  )
}

export default DashboardWrapper