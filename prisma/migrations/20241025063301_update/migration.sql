/*
  Warnings:

  - Made the column `description` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imgUrl` on table `App` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "App" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "imgUrl" SET NOT NULL;
