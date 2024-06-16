import { ClassEnrollmentRepository } from '@/repositories/class-enrollment-repository';
import { ClassEnrollment } from '@prisma/client';
import { UnfulfilledPrerequisitesError } from './errors/unfulfilled-prerequisites-error';
import { StudentAlreadyPassedError } from './errors/student-already-passed-error';
import { ScheduleConflitError } from './errors/schedule-conflit-error';
import { StudentCreditsExceededError } from './errors/student-credits-exceeded-error';

interface ClassEnrollmentUseCaseRequest {
  studentId?: string;
  classId?: string;
  classEnrollmentId?: string;
}

export interface ClassEnrollmentUseCaseResponse {
  classEnrollment: ClassEnrollment;
  message?: string;
}

export class ClassEnrollmentUseCase {
  constructor(private classEnrollmetRepository: ClassEnrollmentRepository) {}

  async execute({
    studentId,
    classId,
    classEnrollmentId,
  }: ClassEnrollmentUseCaseRequest): Promise<
    ClassEnrollmentUseCaseResponse | undefined
  > {
    let message: string;

    //RN - Revisao
    if (classEnrollmentId) {
      await this.classEnrollmetRepository.delete(classEnrollmentId);
      return;
    }

    //RN - Classe cheia (adicionado a lista de espera)
    const isClassFull = await this.classEnrollmetRepository.isClassFull(
      classId as string,
    );

    if (isClassFull) {
      await this.classEnrollmetRepository.addOnWaitList({
        classId: classId as string,
        studentId: studentId as string,
      });
      message = 'Aluno adicionado a lista de espera com sucesso';
      return;
    }

    // RN - Prerequisitos
    const hasCompletedPrerequsite =
      await this.classEnrollmetRepository.hasCompletedPrerequisite({
        classId: classId as string,
        studentId: studentId as string,
      });

    if (!hasCompletedPrerequsite) {
      throw new UnfulfilledPrerequisitesError();
    }

    // RN - Ja passou na materia
    const hasCompletedClass =
      await this.classEnrollmetRepository.hasCompletedClass({
        classId: classId as string,
        studentId: studentId as string,
      });

    if (hasCompletedClass) {
      throw new StudentAlreadyPassedError();
    }

    const hasConflitOnSchedule =
      await this.classEnrollmetRepository.hasConflitOnSchedule({
        studentId: studentId as string,
        classId: classId as string,
      });

    //conflito de horarios
    if (hasConflitOnSchedule) {
      throw new ScheduleConflitError();
    }

    // limite de creditos
    const totalCreditsByStudent =
      await this.classEnrollmetRepository.totalCreditsByStudent(
        studentId as string,
      );

    const classCredits = await this.classEnrollmetRepository.getClassCredits(
      classId as string,
    );

    if (totalCreditsByStudent + classCredits > 20) {
      throw new StudentCreditsExceededError();
    }

    const classEnrollment = await this.classEnrollmetRepository.addEnrollment({
      classId: classId as string,
      studentId: studentId as string,
    });
    message = 'Aluno matriculado com sucesso';

    return {
      classEnrollment,
      message,
    };
  }
}
