/*
  Warnings:

  - Added the required column `title` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "App" ADD COLUMN     "imgUrl" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;