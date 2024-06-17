import {
  All,
  Body,
  Controller,
  ForbiddenException,
  PreconditionFailedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/pipes/zod-validator-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import {
  ClassEnrollmentUseCase,
  ClassEnrollmentUseCaseResponse,
} from '@/use-cases/class-enrollment-use-case';
import { PrismaClassEnrollmentRepository } from '@/repositories/prisma/prisma-class-enrollment-repository';
import { StudentAlreadyPassedError } from '@/use-cases/errors/student-already-passed-error';
import { ScheduleConflitError } from '@/use-cases/errors/schedule-conflit-error';
import { StudentCreditsExceededError } from '@/use-cases/errors/student-credits-exceeded-error';
import { UnfulfilledPrerequisitesError } from '@/use-cases/errors/unfulfilled-prerequisites-error';

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

    const prismaRepository = new PrismaClassEnrollmentRepository();

    const classEnrollmentUseCase = new ClassEnrollmentUseCase(prismaRepository);

    let response: ClassEnrollmentUseCaseResponse | undefined;

    try {
      response = await classEnrollmentUseCase.execute({
        studentId,
        classId,
        classEnrollmentId,
      });
    } catch (error) {
      if (error instanceof StudentCreditsExceededError) {
        return new ForbiddenException(error.message);
      }
      if (error instanceof ScheduleConflitError) {
        return new ForbiddenException(error.message);
      }
      if (error instanceof StudentAlreadyPassedError) {
        return new PreconditionFailedException(error.message);
      }
      if (error instanceof UnfulfilledPrerequisitesError) {
        return new PreconditionFailedException(error.message);
      }
    }

    if (response?.waitList) {
      return {
        message: 'Adicionado a lista de espera com sucesso.',
        status: 200,
      };
    }

    if (response?.hasRemoved) {
      return {
        message: 'Matricula removida com sucesso.',
        status: 200,
      };
    }

    return { message: 'Matricula realizada com sucesso.', status: 200 };
  }
}
