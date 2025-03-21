import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    await prisma.comment.deleteMany();
    console.log("Cleared data from Comment");
    await prisma.attachment.deleteMany();
    console.log("Cleared data from Attachment");
    await prisma.taskAssignment.deleteMany();
    console.log("Cleared data from TaskAssignment");
    await prisma.task.deleteMany();
    console.log("Cleared data from Task");
    await prisma.user.deleteMany();
    console.log("Cleared data from User");
    await prisma.projectTeam.deleteMany();
    console.log("Cleared data from ProjectTeam");
    await prisma.project.deleteMany();
    console.log("Cleared data from Project");
    await prisma.team.deleteMany();
    console.log("Cleared data from Team");
    } catch (error) {
    console.error("Error clearing data:", error);
  }
}

async function loadData() {
  try {
    // First, create teams without user references
    const teamData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/team.json"), "utf-8"));
    const teams = await Promise.all(
      teamData.map((team: any) => {
        const { productOwnerUserId, projectManagerUserId, ...teamData } = team;
        return prisma.team.create({
          data: teamData
        });
      })
    );
    console.log("Created teams");

    // Then create users without team references
    const userData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/user.json"), "utf-8"));
    const users = await Promise.all(
      userData.map((user: any) => {
        const { teamId, ...userData } = user;
        return prisma.user.create({
          data: userData
        });
      })
    );
    console.log("Created users");

    // Now update teams with user references
    await Promise.all(
      teamData.map((team: any, index: number) => {
        return prisma.team.update({
          where: { id: teams[index].id },
          data: {
            productOwnerUserId: team.productOwnerUserId,
            projectManagerUserId: team.projectManagerUserId
          }
        });
      })
    );
    console.log("Updated teams with user references");

    // Finally update users with team references
    await Promise.all(
      userData.map((user: any, index: number) => {
        if (user.teamId && user.teamId <= teams.length) {
          return prisma.user.update({
            where: { userId: users[index].userId },
            data: { teamId: teams[user.teamId - 1].id }
          });
        }
      })
    );
    console.log("Updated users with team references");

    // Load projects
    const projectData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/project.json"), "utf-8"));
    const projects = await Promise.all(
      projectData.map((project: any) => prisma.project.create({ data: project }))
    );
    console.log("Created projects");

    // Load project teams
    const projectTeamData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/projectTeam.json"), "utf-8"));
    await Promise.all(
      projectTeamData.map((projectTeam: any) => {
        const { id, ...data } = projectTeam;
        return prisma.projectTeam.create({
          data: {
            ...data,
            teamId: teams[data.teamId - 1].id,
            projectId: projects[data.projectId - 1].id
          }
        });
      })
    );
    console.log("Created project teams");

    // Load tasks
    const taskData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/task.json"), "utf-8"));
    const tasks = await Promise.all(
      taskData.map((task: any) => {
        const { tags, id, projectId, ...taskData } = task;
        return prisma.task.create({
          data: {
            ...taskData,
            projectId: projects[projectId - 1].id,
            tags: Array.isArray(tags) ? tags : []
          }
        });
      })
    );
    console.log("Created tasks");

    // Load task assignments
    const taskAssignmentData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/taskAssignment.json"), "utf-8"));
    await Promise.all(
      taskAssignmentData.map((taskAssignment: any) => {
        const { id, taskId, ...data } = taskAssignment;
        return prisma.taskAssignment.create({
          data: {
            ...data,
            taskId: tasks[taskId - 1].id
          }
        });
      })
    );
    console.log("Created task assignments");

    // Load attachments
    const attachmentData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/attachment.json"), "utf-8"));
    await Promise.all(
      attachmentData.map((attachment: any) => {
        const { id, taskId, ...data } = attachment;
        return prisma.attachment.create({
          data: {
            ...data,
            taskId: tasks[taskId - 1].id
          }
        });
      })
    );
    console.log("Created attachments");

    // Load comments
    const commentData = JSON.parse(await fs.readFile(path.join(__dirname, "dataset/comment.json"), "utf-8"));
    await Promise.all(
      commentData.map((comment: any) => {
        const { id, taskId, ...data } = comment;
        return prisma.comment.create({
          data: {
            ...data,
            taskId: tasks[taskId - 1].id
          }
        });
      })
    );
    console.log("Created comments");

    console.log("Data loading completed successfully");
  } catch (error) {
    console.error("Error in data loading process:", error);
    throw error;
  }
}

async function main() {
  try {
    await deleteAllData();
    await loadData();
    } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
