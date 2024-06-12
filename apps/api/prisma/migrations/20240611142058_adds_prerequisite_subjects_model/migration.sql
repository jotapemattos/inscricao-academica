/*
  Warnings:

  - You are about to drop the column `chapterId` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_chapterId_fkey";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "chapterId";

-- CreateTable
CREATE TABLE "Prerequisite" (
    "id" SERIAL NOT NULL,
    "targetSubjectId" INTEGER NOT NULL,
    "prerequisiteSubjectId" INTEGER NOT NULL,

    CONSTRAINT "Prerequisite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedCourse" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,

    CONSTRAINT "CompletedCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompletedCourse_studentId_subjectId_key" ON "CompletedCourse"("studentId", "subjectId");

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_targetSubjectId_fkey" FOREIGN KEY ("targetSubjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prerequisite" ADD CONSTRAINT "Prerequisite_prerequisiteSubjectId_fkey" FOREIGN KEY ("prerequisiteSubjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedCourse" ADD CONSTRAINT "CompletedCourse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedCourse" ADD CONSTRAINT "CompletedCourse_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
