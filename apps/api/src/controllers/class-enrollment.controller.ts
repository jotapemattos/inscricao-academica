import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validator-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const classEnrollmentBodySchema = z.object({
  studentId: z.string(),
  classId: z.string(),
});

type ClassEnrollmentBodySchema = z.infer<typeof classEnrollmentBodySchema>;

@Controller('class-enrollment')
@UsePipes(new ZodValidationPipe(classEnrollmentBodySchema))
export class ClassEnrollmentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: ClassEnrollmentBodySchema) {
    const { studentId, classId } = body;

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

    // RN02 - Quantidade de alunos possíveis
    if (selectedClass!.maxStudents <= classEnrollments) {
      await this.prisma.waitList.create({
        data: {
          studentId,
          classId,
        },
      });
      return 'Aluno adicionado a lista de espera';
    }

    await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  }
}
