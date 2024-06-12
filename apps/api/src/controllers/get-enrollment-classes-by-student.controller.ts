import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('class-enrollments-by-student')
export class GetClassEnrollmentsByStudentController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('studentId') studentId: string) {
    return await this.prisma.classEnrollment.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
    });
  }
}
