import { ClassEnrollment, WaitList } from '@prisma/client';

export interface ClassEnrollmentRepository {
  delete(classEnrollmentId: string);
  getClassCredits(classId: string): Promise<number>;
  totalCreditsByStudent(studentId: string): Promise<number>;
  hasCompletedPrerequisite({
    classId,
    studentId,
  }: {
    classId: string;
    studentId: string;
  }): Promise<boolean>;
  hasCompletedClass({
    classId,
    studentId,
  }: {
    classId: string;
    studentId: string;
  }): Promise<boolean>;
  isClassFull(classId: string): Promise<boolean>;
  hasConflitOnSchedule({
    classId,
    studentId,
  }: {
    classId: string;
    studentId: string;
  }): Promise<boolean>;
  addEnrollment({
    classId,
    studentId,
  }: {
    classId: string;
    studentId: string;
  }): Promise<ClassEnrollment>;
  addOnWaitList({
    classId,
    studentId,
  }: {
    classId: string;
    studentId: string;
  }): Promise<WaitList>;
}
