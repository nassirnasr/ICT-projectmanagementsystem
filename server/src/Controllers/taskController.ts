import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma =  new PrismaClient();
// get tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query;
    
    try {
        const tasks = await prisma.task.findMany({
            where: projectId ? { 
                projectId: Number(projectId) 
            } : {},
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            }
        });
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ 
            message: `Error retrieving tasks: ${error.message}`
        });
    }
};


// create new task
export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { 
        title, 
        description, 
        status,
        priority,
        tags,
        startDate, 
        dueDate ,
        points,
        projectId,
        authorUserId,
        assignedUserId,
    } = req.body;

    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate: new Date(startDate),
                dueDate: new Date(dueDate),
                points,
                projectId,
                authorUserId,
                assignedUserId,  
            },
        });
        res.status(201).json(newTask);
    } catch (error: any) {
        res.status(500).json({ message: `Error creating task: ${error.message}` });
    }
};

// update tasks
export const updateTaskStatus = async (
    req: Request,
    res: Response
): Promise<void> =>{
    const {taskId} = req.params;
    const {status} = req.body;
    try {
        const updatedTask = await prisma.task.update(
            {
                where: {
                    id: Number(taskId),
                },
               data: {
                status: status,
               }
            }
        );
        res.json(updatedTask);
    } catch (error:any) {
        res.status(500).json({ message: `Error updating task ${error.message}`});
    }
};


//Get User Tasks
export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                assignedUserId: userId,
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });

        if (!tasks.length) {
            res.status(404).json({ message: "No tasks found for this user" });
            return;
        }

        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving user's tasks: ${error.message}` });
    }
};
