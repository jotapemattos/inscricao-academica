import {
  Student,
  Class,
  ClassEnrollment,
  WaitList,
  Subject,
  CompletedSubject,
  Prerequisite,
} from '@prisma/client';
import { ClassEnrollmentRepository } from '../class-enrollment-repository';

export class InMemoryClassEnrollmentRepository
  implements ClassEnrollmentRepository
{
  public students: Student[] = [];
  public classes: Class[] = [];
  public waitList: WaitList[] = [];
  public classEnrollments: ClassEnrollment[] = [];
  public subjects: Subject[] = [];
  public completedSubjects: CompletedSubject[] = [];
  public prerequisites: Prerequisite[] = [];

  async delete(classEnrollmentId: string) {
    const filteredClassEnrollments = this.classEnrollments.filter(
      (classEnrollment) => classEnrollment.id !== classEnrollmentId,
    );

    this.classEnrollments = filteredClassEnrollments;

    return this.classEnrollments;
  }

  async hasCompletedClass({ classId, studentId }) {
    const selectedClass = this.classes.find((item) => item.id === classId);

    const selectedSubject = this.subjects.find(
      (subject) => subject.id === selectedClass?.subjectId,
    );

    const hasCompleted = this.completedSubjects.find(
      (item) =>
        item.studentId === studentId && item.subjectId === selectedSubject?.id,
    );

    if (hasCompleted) {
      return hasCompleted.passed;
    }

    return false;
  }

  async isClassFull(classId: string) {
    const selectedClassEnrollments = this.classEnrollments.filter(
      (item) => item.classId === classId,
    );

    const selectedClass = this.classes.find((item) => item.id === classId);

    const isFull =
      selectedClass!.maxStudents <= selectedClassEnrollments.length;

    return isFull;
  }

  async addOnWaitList({ classId, studentId }) {
    const newItem: WaitList = {
      id: new Date().toISOString(),
      classId,
      studentId,
    };

    this.waitList.push(newItem);

    return newItem;
  }

  async hasCompletedPrerequisite({ classId, studentId }) {
    //Nao foi necessario implementar
    return true;
  }

  async hasConflictOnSchedule({ classId, studentId }) {
    //Nao foi necessario implementar
    /*     const selectedClass = this.classes.find((item) => item.id === classId);

    const conflictSchedule = this.classEnrollments.filter((item) => {
      const currentClass = this.classes.find(
        (current) =>
          current.id === item.classId && item.studentId === studentId,
      );
      return (
        selectedClass?.startTime.getTime() === currentClass?.startTime.getTime()
      );
    });

    const hasConflit = conflictSchedule.length > 0;

    return hasConflit; */
    return false;
  }

  async totalCreditsByStudent(studentId: string) {
    const enrollmentsByStudent = this.classEnrollments.filter(
      (item) => item.studentId === studentId,
    );
    let credits = 0;

    enrollmentsByStudent.forEach((item) => {
      const currentClass = this.classes.find(
        (current) => current.id === item.classId,
      );

      const currentSubject = this.subjects.find(
        (current) => current.id === currentClass?.subjectId,
      );

      credits += currentSubject!.credits;
    });
    return credits;
  }

  async addEnrollment({ classId, studentId }) {
    const newEnrollment: ClassEnrollment = {
      id: new Date().toISOString(),
      classId,
      studentId,
    };

    this.classEnrollments.push(newEnrollment);

    return newEnrollment;
  }

  async getClassCredits(classId: string) {
    const currentClass = this.classes.find((item) => item.id === classId);

    const currentsubject = this.subjects.find(
      (item) => item.id === currentClass?.subjectId,
    );

    return currentsubject!.credits;
  }

  async addStudent(student: Student) {
    this.students.push(student);
  }

  async addClass(newClass: Class) {
    this.classes.push(newClass);
  }

  async addSubject(subject: Subject) {
    this.subjects.push(subject);
  }

  async addPrerequisite(prerequisite: Prerequisite) {
    this.prerequisites.push(prerequisite);
  }

  async addCompletedSubject(completedSubject: CompletedSubject) {
    this.completedSubjects.push(completedSubject);
  }
}
