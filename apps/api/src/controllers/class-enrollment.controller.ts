import {
  All,
  Body,
  Controller,
  ForbiddenException,
  PreconditionFailedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validator-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const classEnrollmentBodySchema = z.object({
  studentId: z.string().optional(),
  classId: z.string().optional(),
  classEnrollmentId: z.string().optional(),
});

type ClassEnrollmentBodySchema = z.infer<typeof classEnrollmentBodySchema>;

@Controller('class-enrollment')
@UsePipes(new ZodValidationPipe(classEnrollmentBodySchema))
export class ClassEnrollmentController {
  constructor(private prisma: PrismaService) {}

  @All()
  async handle(@Body() body: ClassEnrollmentBodySchema) {
    const { studentId, classId, classEnrollmentId } = body;

    if (classEnrollmentId) {
      await this.prisma.classEnrollment.delete({
        where: {
          id: classEnrollmentId,
        },
      });
      return {
        status: 200,
        message: 'Matrícula removida com sucesso',
      };
    }

    const selectedClass = await this.prisma.class.findFirst({
      where: {
        id: classId,
      },
    });

    const classEnrollments = await this.prisma.classEnrollment.count({
      where: {
        classId,
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

    const selectedSubject = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { subject: true },
    });

    const totalCredits = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.class.subject.credits || 0);
    }, 0);

    const conflictSchedule = enrollments.filter(
      (enrolmment) =>
        enrolmment.class.startTime.getTime() ===
        selectedClass?.startTime.getTime(),
    );

    const isSubjectCompleted = await this.prisma.completedSubject.findFirst({
      where: {
        studentId,
        subjectId: selectedSubject?.subjectId,
      },
      select: {
        passed: true,
      },
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

    // RN02 - Quantidade de alunos possíveis
    if (
      selectedClass!.maxStudents <= classEnrollments &&
      studentId &&
      classId
    ) {
      await this.prisma.waitList.create({
        data: {
          studentId,
          classId,
        },
      });
      return { message: 'Aluno adicionado a lista de espera' };
    }

    // RN00
    if (conflictSchedule.length > 0) {
      throw new ForbiddenException(
        'Não foi possível se matricular na matéria. O aluno já possui aula nesse horário. ',
      );
    }

    // RN01 - Quantidade máxima de inscrições por semestre letivo
    if (totalCredits + selectedSubject!.subject.credits > 20) {
      throw new ForbiddenException(
        'Não foi possível se matricular na matéria. O aluno ultrapassou o limite de créditos.',
      );
    }

    // RN03 - Um aluno não pode se inscrever em uma turma de uma disciplina para a qual não possua os pre requisitos necessários. Além disso, um aluno não pode se inscrever em uma turma de alguma disciplina que já tenha cursado com aprovação.
    if (isSubjectCompleted) {
      throw new PreconditionFailedException(
        'Não foi possível se matricular na matéria. O aluno já foi aprovado nessa disciplina',
      );
    }
    if (prerequiste && !isPrerequisiteCompleted?.passed) {
      throw new PreconditionFailedException(
        `Não foi possível se matricular na matéria. A disciplina "${selectedSubject?.subject.name}" exige aprovação na disciplina "${prerequiste?.prerequisiteSubject.name}"`,
      );
    }
    if (studentId && classId) {
      await this.prisma.classEnrollment.create({
        data: {
          studentId,
          classId,
        },
      });
      return { message: 'Matrícula realizada com sucesso.' };
    }
  }
}
