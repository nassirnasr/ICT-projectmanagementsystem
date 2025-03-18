'use client'
import { Priority, Project, Task, Team, useGetProjectsQuery, useGetTasksQuery, useGetTeamsQuery, useGetUsersQuery } from '@/state/api'
import { useAppSelector } from '../../redux';
import Header from '@/components/Header';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@clerk/nextjs';
import { Briefcase, Users, AlertTriangle, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingPage from '../Loading';

const TeamLeaderPage = () => {
 
 
  const { userId } = useAuth();
  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsQuery();
  const { data: allProjects, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const { data: allTasks, isLoading: isLoadingTasks } = useGetTasksQuery({ projectId: 0 });
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Combine loading states
  const isLoading = isLoadingTeams || isLoadingProjects || isLoadingTasks || isLoadingUsers;

  // Show loading page while data is fetching
  if (isLoading) return <LoadingPage />;
  

  // Get the team the current user leads
  const myTeam = teams?.find(t => t.projectManagerUserId === Number(userId));
  const teamProjects = allProjects?.filter(p => p.teamId === myTeam?.teamId) || [];
  const teamTasks = allTasks?.filter(t => 
    teamProjects.some(p => p.id === t.projectId)
  ) || [];
  const teamMembers = users?.filter(u => u.teamId === myTeam?.teamId) || [];

  const projectProgressData = teamProjects.map(project => ({
    name: project.name,
    progress: Math.floor(Math.random() * 100) // Replace with actual progress calculation
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

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {member.username.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{member.username}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamLeaderPage;