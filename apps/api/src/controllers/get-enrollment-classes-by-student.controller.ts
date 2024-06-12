import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type RequestParams = {
  studentId: string;
};

@Controller('class-enrollments-by-student')
export class GetClassEnrollmentsByStudentController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async handle(@Param() params: RequestParams) {
    return await this.prisma.classEnrollment.findMany({
      include: {
        class: {
          include: {
            subject: true,
          },
        },
      },
      where: {
        studentId: params.studentId,
      },
    });
  }
}
