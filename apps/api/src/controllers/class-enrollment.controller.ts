import { Body, Controller, Post, UsePipes } from '@nestjs/common';
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

    // RN02 - Quantidade de alunos possíveis
    if (selectedClass!.maxStudents <= classEnrollments) {
      return await this.prisma.waitList.create({
        data: {
          studentId,
          classId,
        },
      });
    }

    return await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  }
}
