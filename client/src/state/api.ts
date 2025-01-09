import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project{
    id: number;
    name: string;
    description?:string;
    startDate?:string;
    endDate? :string;
}

export enum Priority{
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog"
}
//one of these can be selected
export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed"
}

export interface User{
    userId?: number;
    username:string;
    email:string;
    profilePictureUrl?:string;
    cognitoId?:string;
    teamId?:number;
}

export interface Attachment {
    id: number;
    fileUrl:string;
    fileName:string;
    taskId:number;
    uploadedById:number;
}
export interface Task {
       id:number;
       title:string; 
        description?:string; 
        status?:Status;
        priority?:Priority;
        tags?:string;
        startDate?:string; 
        dueDate? :string;
        points?:number;
        projectId:number;
        authorUserId?:number;
        assignedUserId?:number;

        author?:User;
        assignee?:User;
        comments?:Comment[];
        attachments?:Attachment[];
}
        //interface for search
export interface SearchResults {
    tasks? : Task[];
    projects? : Project[];
    users? : User[];
}
     //interface for team
export interface Team{
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
}


export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users", "Teams"],
    endpoints: (build) => ({
        //get project
        getProjects: build.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        //create project
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects",
                method: "POST",
                body: project,
            }),
            invalidatesTags: ["Projects"],
        }),


        //get task
        getTasks: build.query<Task[], { projectId:number}>({
            query: ({projectId}) => `tasks?projectId=${projectId}`,
            providesTags: (result) => 
                result 
                    ? result.map(({id}) => ({type: "Tasks" as const , id})) 
                    : [{type: "Tasks" as const}],
        }),

        //get user tasks
        getTaskByUser: build.query<Task[], number>({
            query:(userId) =>`tasks/user/${userId}`,
            providesTags: (result, error, userId) => 
                result 
                ?result.map(({id}) => ({type: "Tasks", id}))
                : [{type: "Tasks", id:userId}],
        }),

         //create task
         createTask: build.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks",
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Tasks"],
        }),

        //update task status
        updateTaskStatus: build.mutation<Task, {taskId:number; status:string}>({
            query: ({taskId , status}) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: {status},
            }),
            invalidatesTags: (result, error , {taskId}) =>[
                {type:"Tasks", id:taskId},
            ],
        }),

        //users
        getUsers:build.query<User[], void>({
            query: () => "users",
            providesTags: ["Users"]
        }),

        //search
        search: build.query<SearchResults, string>({
            query: (query) => `search?query=${query}`,
        }),

        //team
        getTeams: build.query<Team[], void>({
            query: () => "teams",
            providesTags: ["Teams"]
        }),
    }),
    
    
});

export const { 
    useGetProjectsQuery, 
    useCreateProjectMutation ,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useSearchQuery,
    useGetUsersQuery,
    useGetTeamsQuery,
    useGetTaskByUserQuery,
} = api;
