import { ClassEnrollmentRepository } from '../class-enrollment-repository';
import { PrismaService } from '@/prisma/prisma.service';

export class PrismaClassEnrollmentRepository
  implements ClassEnrollmentRepository
{
  prisma = new PrismaService();

  async delete(classEnrollmentId: string) {
    await this.prisma.classEnrollment.delete({
      where: {
        id: classEnrollmentId,
      },
    });
  }

  async hasCompletedClass({ studentId, classId }) {
    const selectedSubject = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { subject: true },
    });

    const hasPassed = await this.prisma.completedSubject.findFirst({
      where: {
        studentId,
        subjectId: selectedSubject?.subjectId,
      },
      select: {
        passed: true,
      },
    });

    if (hasPassed) {
      return hasPassed?.passed;
    }

    return false;
  }

  async isClassFull(classId: string): Promise<boolean> {
    const classEnrollments = await this.prisma.classEnrollment.count({
      where: {
        classId,
      },
    });

    const selectedClass = await this.prisma.class.findFirst({
      where: {
        id: classId,
      },
    });

    const isFull = selectedClass!.maxStudents <= classEnrollments;

    return isFull;
  }

  async addOnWaitList({ classId, studentId }) {
    const waitList = await this.prisma.waitList.create({
      data: {
        studentId,
        classId,
      },
    });

    return waitList;
  }

  async hasCompletedPrerequisite({ classId, studentId }) {
    const selectedSubject = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { subject: true },
    });

    const prerequiste = await this.prisma.prerequisite.findFirst({
      where: {
        targetSubjectId: selectedSubject?.subjectId,
      },
      select: {
        prerequisiteSubject: true,
      },
    });

    const isPrerequisiteCompleted =
      await this.prisma.completedSubject.findFirst({
        where: {
          studentId,
          subjectId: prerequiste?.prerequisiteSubject.id,
        },
        select: {
          passed: true,
        },
      });

    if (isPrerequisiteCompleted) {
      return isPrerequisiteCompleted.passed;
    }

    return true;
  }

  async hasConflitOnSchedule({ classId, studentId }) {
    const selectedClass = await this.prisma.class.findFirst({
      where: {
        id: classId,
      },
    });

    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { studentId: studentId },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
    });

    const conflictSchedule = enrollments.filter(
      (enrolmment) =>
        enrolmment.class.startTime.getTime() ===
        selectedClass?.startTime.getTime(),
    );

    const hasConflit = conflictSchedule.length > 0;

    return hasConflit;
  }

  async totalCreditsByStudent(studentId: string) {
    const enrollments = await this.prisma.classEnrollment.findMany({
      where: { studentId: studentId },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
    });

    const totalCredits = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.class.subject.credits || 0);
    }, 0);

    return totalCredits;
  }

  async getClassCredits(classId: string) {
    const selectedSubject = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { subject: true },
    });

    return selectedSubject!.subject.credits;
  }

  async addEnrollment({ classId, studentId }) {
    const enrollment = await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });

    return enrollment;
  }
}
