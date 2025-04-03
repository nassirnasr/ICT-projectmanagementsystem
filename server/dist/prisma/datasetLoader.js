"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.comment.deleteMany();
            console.log("Cleared data from Comment");
            yield prisma.attachment.deleteMany();
            console.log("Cleared data from Attachment");
            yield prisma.taskAssignment.deleteMany();
            console.log("Cleared data from TaskAssignment");
            yield prisma.task.deleteMany();
            console.log("Cleared data from Task");
            yield prisma.user.deleteMany();
            console.log("Cleared data from User");
            yield prisma.projectTeam.deleteMany();
            console.log("Cleared data from ProjectTeam");
            yield prisma.project.deleteMany();
            console.log("Cleared data from Project");
            yield prisma.team.deleteMany();
            console.log("Cleared data from Team");
        }
        catch (error) {
            console.error("Error clearing data:", error);
        }
    });
}
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // First, create teams without user references
            const teamData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/team.json"), "utf-8"));
            const teams = yield Promise.all(teamData.map((team) => {
                const { productOwnerUserId, projectManagerUserId } = team, teamData = __rest(team, ["productOwnerUserId", "projectManagerUserId"]);
                return prisma.team.create({
                    data: teamData
                });
            }));
            console.log("Created teams");
            // Then create users without team references
            const userData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/user.json"), "utf-8"));
            const users = yield Promise.all(userData.map((user) => {
                const { teamId } = user, userData = __rest(user, ["teamId"]);
                return prisma.user.create({
                    data: userData
                });
            }));
            console.log("Created users");
            // Now update teams with user references
            yield Promise.all(teamData.map((team, index) => {
                return prisma.team.update({
                    where: { id: teams[index].id },
                    data: {
                        productOwnerUserId: team.productOwnerUserId,
                        projectManagerUserId: team.projectManagerUserId
                    }
                });
            }));
            console.log("Updated teams with user references");
            // Finally update users with team references
            yield Promise.all(userData.map((user, index) => {
                if (user.teamId && user.teamId <= teams.length) {
                    return prisma.user.update({
                        where: { userId: users[index].userId },
                        data: { teamId: teams[user.teamId - 1].id }
                    });
                }
            }));
            console.log("Updated users with team references");
            // Load projects
            const projectData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/project.json"), "utf-8"));
            const projects = yield Promise.all(projectData.map((project) => prisma.project.create({ data: project })));
            console.log("Created projects");
            // Load project teams
            const projectTeamData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/projectTeam.json"), "utf-8"));
            yield Promise.all(projectTeamData.map((projectTeam) => {
                const { id } = projectTeam, data = __rest(projectTeam, ["id"]);
                return prisma.projectTeam.create({
                    data: Object.assign(Object.assign({}, data), { teamId: teams[data.teamId - 1].id, projectId: projects[data.projectId - 1].id })
                });
            }));
            console.log("Created project teams");
            // Load tasks
            const taskData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/task.json"), "utf-8"));
            const tasks = yield Promise.all(taskData.map((task) => {
                const { tags, id, projectId } = task, taskData = __rest(task, ["tags", "id", "projectId"]);
                return prisma.task.create({
                    data: Object.assign(Object.assign({}, taskData), { projectId: projects[projectId - 1].id, tags: Array.isArray(tags) ? tags : [] })
                });
            }));
            console.log("Created tasks");
            // Load task assignments
            const taskAssignmentData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/taskAssignment.json"), "utf-8"));
            yield Promise.all(taskAssignmentData.map((taskAssignment) => {
                const { id, taskId } = taskAssignment, data = __rest(taskAssignment, ["id", "taskId"]);
                return prisma.taskAssignment.create({
                    data: Object.assign(Object.assign({}, data), { taskId: tasks[taskId - 1].id })
                });
            }));
            console.log("Created task assignments");
            // Load attachments
            const attachmentData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/attachment.json"), "utf-8"));
            yield Promise.all(attachmentData.map((attachment) => {
                const { id, taskId } = attachment, data = __rest(attachment, ["id", "taskId"]);
                return prisma.attachment.create({
                    data: Object.assign(Object.assign({}, data), { taskId: tasks[taskId - 1].id })
                });
            }));
            console.log("Created attachments");
            // Load comments
            const commentData = JSON.parse(yield fs_1.promises.readFile(path_1.default.join(__dirname, "dataset/comment.json"), "utf-8"));
            yield Promise.all(commentData.map((comment) => {
                const { id, taskId } = comment, data = __rest(comment, ["id", "taskId"]);
                return prisma.comment.create({
                    data: Object.assign(Object.assign({}, data), { taskId: tasks[taskId - 1].id })
                });
            }));
            console.log("Created comments");
            console.log("Data loading completed successfully");
        }
        catch (error) {
            console.error("Error in data loading process:", error);
            throw error;
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield deleteAllData();
            yield loadData();
        }
        catch (error) {
            console.error("Error in main process:", error);
            process.exit(1);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
main();
