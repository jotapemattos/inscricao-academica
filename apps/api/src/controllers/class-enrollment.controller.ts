import { All, Body, Controller, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipes/zod-validator-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';
import { ClassEnrollmentUseCase } from '@/use-cases/class-enrollment-use-case';
import { PrismaClassEnrollmentRepository } from '@/repositories/prisma/prisma-class-enrollment-repository';

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

    try {
      const enrollment = await classEnrollmentUseCase.execute({
        studentId,
        classId,
        classEnrollmentId,
      });

      if (enrollment) {
        return { message: 'Deu certo' };
      }
    } catch (error) {
      console.log(error);
    }

    return { message: 'Deu certo' };
  }
}
