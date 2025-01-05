import { PrismaClient } from "@prisma/client";
import fs from "fs/promises"; // Use async fs
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "dataset");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    try {
      const jsonData = JSON.parse(await fs.readFile(filePath, "utf-8"));
      const modelName = path.basename(fileName, path.extname(fileName));
      const model: any = prisma[modelName as keyof typeof prisma];

      for (const data of jsonData) {
        await model.create({ data }); // Ensure correct data structure
      }
      console.log(`Loaded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error loading data for ${fileName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
