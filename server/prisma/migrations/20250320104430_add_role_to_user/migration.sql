-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'team_leader', 'client', 'team_member');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'team_member';
