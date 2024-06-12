/*
  Warnings:

  - You are about to drop the `ClassEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletedCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prerequisite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WaitList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassEnrollment" DROP CONSTRAINT "ClassEnrollment_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassEnrollment" DROP CONSTRAINT "ClassEnrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedCourse" DROP CONSTRAINT "CompletedCourse_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedCourse" DROP CONSTRAINT "CompletedCourse_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_prerequisiteSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "Prerequisite" DROP CONSTRAINT "Prerequisite_targetSubjectId_fkey";

-- DropForeignKey
ALTER TABLE "WaitList" DROP CONSTRAINT "WaitList_classId_fkey";

-- DropForeignKey
ALTER TABLE "WaitList" DROP CONSTRAINT "WaitList_studentId_fkey";

-- DropTable
DROP TABLE "ClassEnrollment";

-- DropTable
DROP TABLE "CompletedCourse";

-- DropTable
DROP TABLE "Prerequisite";

-- DropTable
DROP TABLE "WaitList";

-- CreateTable
CREATE TABLE "prequisites" (
    "id" SERIAL NOT NULL,
    "targetSubjectId" INTEGER NOT NULL,
    "prerequisiteSubjectId" INTEGER NOT NULL,

    CONSTRAINT "prequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_enrollments" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "class_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wait_list" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "wait_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_subjects" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,

    CONSTRAINT "completed_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_enrollments_studentId_classId_key" ON "class_enrollments"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_studentId_classId_key" ON "wait_list"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "completed_subjects_studentId_subjectId_key" ON "completed_subjects"("studentId", "subjectId");

-- AddForeignKey
ALTER TABLE "prequisites" ADD CONSTRAINT "prequisites_targetSubjectId_fkey" FOREIGN KEY ("targetSubjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prequisites" ADD CONSTRAINT "prequisites_prerequisiteSubjectId_fkey" FOREIGN KEY ("prerequisiteSubjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wait_list" ADD CONSTRAINT "wait_list_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wait_list" ADD CONSTRAINT "wait_list_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_subjects" ADD CONSTRAINT "completed_subjects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_subjects" ADD CONSTRAINT "completed_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
