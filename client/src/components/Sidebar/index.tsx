"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Clock,
  FolderOpenDot,
  Home,
  Hourglass,
  Icon,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
  Flag,
  
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);

  const priorities = [
    { id: 1, label: "High Priority", icon: AlertOctagon, color: "text-red-500" },
    { id: 2, label: "Medium Priority", icon: AlertTriangle, color: "text-orange-500" },
    { id: 3, label: "Low Priority", icon: AlertCircle, color: "text-blue-500" },
  ];

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setIsSidebarCollapsed(true));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const SidebarClassName = `
    fixed left-0 top-0 flex flex-col h-screen bg-white dark:bg-dark-sidebar
    shadow-lg transition-all duration-300 ease-in-out z-40
    border-r border-gray-200 dark:border-stroke-dark
    ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
    ${isSidebarCollapsed ? 'md:translate-x-0 -translate-x-full' : 'translate-x-0'}
  `;

  return (
    <>
      {/* Overlay for mobile */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}

      <aside className={SidebarClassName}>
        {/* Logo Section */}
        <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-stroke-dark dark:bg-dark-sidebar/80">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" width={35} height={35} alt="Logo" className="rounded-lg" />
            {!isSidebarCollapsed && (
              <span className="font-semibold text-gray-800 dark:text-gray-200">Dashboard</span>
            )}
          </div>
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="hidden md:block text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isSidebarCollapsed ? "" : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Team Section */}
          {!isSidebarCollapsed && (
            <div className="mx-3 my-4 rounded-lg bg-gray-50 p-3 dark:bg-dark-secondary">
              <div className="flex items-center gap-3">
                <Image src="/nasr.png" alt="" width={32} height={32} className="rounded-lg" />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">NASR TEAM</h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    <LockIcon className="h-3 w-3 text-gray-500" />
                    <p className="text-xs text-gray-500">Private</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="px-3 space-y-0.5">
            <SidebarLink icon={Home} label="Home" href="/" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={Clock} label="Recent" href="/recent" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={Search} label="Search" href="/search" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={CalendarClock} label="Timeline" href="/timeline" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={Hourglass} label="Upcoming" href="/upcoming" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={User} label="Users" href="/users" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={Users} label="Team" href="/teams" collapsed={isSidebarCollapsed} />
            <SidebarLink icon={Layers3} label="Projects" href="/projects" collapsed={isSidebarCollapsed} />
            
          </nav>

          {/* Priorities Section */}
          {!isSidebarCollapsed && (
            <>
              <div className="mt-6 px-4">
                <button
                  onClick={() => setShowPriority(prev => !prev)}
                  className="flex w-full items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span className="font-medium">Priorities</span>
                  </div>
                  {showPriority ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {showPriority && (
                <div className="mt-1 px-3">
                  {priorities.map((priority) => (
                    <Link
                      key={priority.id}
                      href={`/priorities/${priority.id}`}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-hover"
                    >
                      <priority.icon className={`h-4 w-4 ${priority.color}`} />
                      <span className="truncate text-sm">{priority.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Projects Section */}
          {!isSidebarCollapsed && (
            <>
              <div className="mt-6 px-4">
                <button
                  onClick={() => setShowProjects(prev => !prev)}
                  className="flex w-full items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpenDot className="h-4 w-4" />
                    <span className="font-medium">Projects</span>
                  </div>
                  {showProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {showProjects && projects?.map((project) => (
                <SidebarLink
                  key={project.id}
                  icon={FolderOpenDot}
                  label={project.name}
                  href={`/projects/${project.id}`}
                  collapsed={isSidebarCollapsed}
                />
              ))}
            </>
          )}

          {/* Settings at the bottom */}
          <div className="mt-auto px-3 pb-6">
            <SidebarLink icon={Settings} label="Settings" href="/settings" collapsed={isSidebarCollapsed} />
          </div>
        </div>
      </aside>
    </>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, collapsed }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href}
      className={`
        group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors
        ${isActive 
          ? 'bg-blue-50 text-blue-600 dark:bg-dark-hover dark:text-blue-400' 
          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-hover'
        }
      `}
    >
      <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
      {collapsed && (
        <div className="absolute left-20 z-50 hidden rounded-md bg-gray-900 px-2 py-1 text-sm text-white group-hover:block">
          {label}
        </div>
      )}
    </Link>
  );
};

export default Sidebar;
