import { PrismaClassEnrollmentRepository } from '@/repositories/prisma/prisma-class-enrollment-repository';
import { expect, describe, it } from 'vitest';

const prismaClassEnrollmentRepository = new PrismaClassEnrollmentRepository();
describe('Teste de integração entre as entidades do banco', () => {
  //testa a integracao da entidade "Class" com "Subject"
  it('should return the quantity of credits a class has', async () => {
    const classCredits = await prismaClassEnrollmentRepository.getClassCredits(
      '0080bdd3-455a-4852-b9f7-072f38280071',
    );
    expect(classCredits).toStrictEqual(expect.any(Number));
    expect(classCredits).toBeGreaterThan(0);
  });

  // testa integracao entre "Class", "Student", "Subject", "CompletedSubject"
  it('should return if the student already has completed the selected subject', async () => {
    const hasCompletedClass =
      await prismaClassEnrollmentRepository.hasCompletedClass({
        classId: '42b061c6-9433-4490-acf0-7aa18d2cbc6e',
        studentId: '87017c76-e9a2-4edb-9bc0-02366c45c13a',
      });
    expect(hasCompletedClass).toStrictEqual(expect.any(Boolean));
    expect(hasCompletedClass).toBe(true);
  });

  // testa integracao entre "Class", "Prerequisite" and "CompletedSubject"
  it('should return if the student already has completed the prerequisite subject', async () => {
    const hasCompletedPrerequisite =
      await prismaClassEnrollmentRepository.hasCompletedPrerequisite({
        classId: '0080bdd3-455a-4852-b9f7-072f38280071',
        studentId: '87017c76-e9a2-4edb-9bc0-02366c45c13a',
      });
    expect(hasCompletedPrerequisite).toStrictEqual(expect.any(Boolean));
    expect(hasCompletedPrerequisite).toBe(false);
  });

  // testa integracao entre "Class", "ClassEnrollment" and "Subject"
  it('should return if the student already has joined a class at the same time', async () => {
    const hasConflictOnSchedule =
      await prismaClassEnrollmentRepository.hasConflictOnSchedule({
        classId: '54316c1e-5101-474d-b77c-71e7a7f0b940',
        studentId: '87017c76-e9a2-4edb-9bc0-02366c45c13a',
      });
    expect(hasConflictOnSchedule).toStrictEqual(expect.any(Boolean));
    expect(hasConflictOnSchedule).toBe(true);
  });

  // testa integracao entre "Class" and "ClassEnrollment"
  it('should return if the class full', async () => {
    const isClassFull = await prismaClassEnrollmentRepository.isClassFull(
      'c5f81075-f847-4b23-8121-44faf6f60fde',
    );
    expect(isClassFull).toStrictEqual(expect.any(Boolean));
    expect(isClassFull).toBe(true);
  });
});
