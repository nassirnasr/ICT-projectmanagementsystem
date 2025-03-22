'use client'
import { Priority, Project, Task, Team, useGetProjectsQuery, useGetTasksQuery, useGetTeamsQuery, useGetUsersQuery, User } from '@/state/api'
import { useAppSelector } from '../../redux';
import Header from '@/components/Header';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@clerk/nextjs';
import { Briefcase, Users, AlertTriangle, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingPage from '../Loading';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';

const TeamLeaderPage = () => {
 
 
  const { userId } = useAuth();
  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsQuery();
  const { data: allProjects, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const { data: allTasks, isLoading: isLoadingTasks } = useGetTasksQuery({ projectId: 0 });
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Combine loading states
  const isLoading = isLoadingTeams || isLoadingProjects || isLoadingTasks || isLoadingUsers;

  // Type definitions
  type TeamMember = User & {
    role: string;
    teamId: number;
    isActive: boolean;
  };

  // Show loading page while data is fetching
  if (isLoading) return <LoadingPage />;

  // Get the current user's team (where they're team leader)
  const myTeam = teams?.find(t => t.projectManagerUserId === userId);
  
  // Team members with type guard
  const teamMembers = (users || []).filter((u): u is TeamMember => 
    u.teamId === myTeam?.teamId && 
    u.role === 'team_member' &&
    typeof u.isActive !== 'undefined'
  );

  // Team projects with type guard
  const teamProjects = (allProjects || []).filter((p): p is Project & { teamId: number } => 
    typeof p.teamId !== 'undefined' && 
    p.teamId === myTeam?.teamId
  );

  const teamTasks = allTasks?.filter(t => 
    teamProjects.some(p => p.id === t.projectId)
  ) || [];

  // DataGrid columns
  const memberColumns: GridColDef<TeamMember>[] = [
    { 
      field: 'username', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {params.row.username.charAt(0)}
          </div>
          <span>{params.row.username}</span>
        </div>
      )
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 0.8,
      valueFormatter: (params: { value: string }) => params.value.replace('_', ' '),
      renderCell: (params) => (
        <Badge variant="outline" className="capitalize">
          {params.row.role?.replace('_', ' ')}
        </Badge>
      )
    },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      flex: 0.6,
      renderCell: (params) => (
        <Badge variant={params.value ? 'default' : 'outline'}>
          {params.value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  // Progress data and priority distribution
  const projectProgressData = teamProjects.map(project => ({
    name: project.name,
    progress: Math.floor(Math.random() * 100)
  }));

  const priorityDistribution = teamTasks.reduce((acc, task) => {
    acc[task.priority || Priority.Backlog] = (acc[task.priority || Priority.Backlog] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return (
    <div className="container p-8">
      <Header name="Team Leadership Dashboard" />
      
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team Projects"
          value={teamProjects.length}
          icon={<Briefcase className="text-blue-500" />}
        />
        <StatCard
          title="Active Tasks"
          value={teamTasks.length}
          icon={<ListTodo className="text-green-500" />}
        />
        <StatCard
          title="Team Members"
          value={teamMembers.length}
          icon={<Users className="text-purple-500" />}
        />
        <StatCard
          title="High Priority"
          value={priorityDistribution[Priority.High] || 0}
          icon={<AlertTriangle className="text-red-500" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="progress" 
                  fill="#8884d8"
                  name="Completion %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="p-4 bg-white rounded-lg shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">Team Members</h3>
          <div className="h-[400px]">
            <DataGrid
              rows={teamMembers}
              columns={memberColumns}
              loading={isLoading}
              getRowId={(row) => row.userId!} 
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderPage;