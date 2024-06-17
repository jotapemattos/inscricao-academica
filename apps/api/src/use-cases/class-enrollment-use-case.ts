import { ClassEnrollmentRepository } from '@/repositories/class-enrollment-repository';
import { ClassEnrollment, WaitList } from '@prisma/client';
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
  classEnrollment?: ClassEnrollment;
  waitList?: WaitList;
  hasRemoved?: boolean;
}

export class ClassEnrollmentUseCase {
  constructor(private classEnrollmetRepository: ClassEnrollmentRepository) {}

  async execute({
    studentId,
    classId,
    classEnrollmentId,
  }: ClassEnrollmentUseCaseRequest): Promise<ClassEnrollmentUseCaseResponse> {
    //Fluxo alternativo - Revisao de matricula
    if (classEnrollmentId) {
      await this.classEnrollmetRepository.delete(classEnrollmentId);
      return { hasRemoved: true };
    }

    //Fluxo alternativo 1 - Classe cheia (adicionado a lista de espera)
    const isClassFull = await this.classEnrollmetRepository.isClassFull(
      classId as string,
    );

    if (isClassFull) {
      const waitList = await this.classEnrollmetRepository.addOnWaitList({
        classId: classId as string,
        studentId: studentId as string,
      });
      return { waitList };
    }

    // RN03 - Aluno nao foi aprovado nas disciplinas que a materia selecionada exige como pre-requisito
    const hasCompletedPrerequsite =
      await this.classEnrollmetRepository.hasCompletedPrerequisite({
        classId: classId as string,
        studentId: studentId as string,
      });

    if (!hasCompletedPrerequsite) {
      throw new UnfulfilledPrerequisitesError();
    }

    // RN03 - Ja foi aprovado na disciplina selecionada
    const hasCompletedClass =
      await this.classEnrollmetRepository.hasCompletedClass({
        classId: classId as string,
        studentId: studentId as string,
      });

    if (hasCompletedClass) {
      throw new StudentAlreadyPassedError();
    }

    const hasConflictOnSchedule =
      await this.classEnrollmetRepository.hasConflictOnSchedule({
        studentId: studentId as string,
        classId: classId as string,
      });

    //RN00 - Aluno ja possui aula no horario da aula que deseja fazer a matricula
    if (hasConflictOnSchedule) {
      throw new ScheduleConflitError();
    }

    //RN01 - Aluno atingiu o limite de creditos
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

    return {
      classEnrollment,
    };
  }
}
