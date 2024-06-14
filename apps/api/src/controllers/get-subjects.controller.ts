import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Controller('subjects')
export class GetSubjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const classesWithSubjects = await this.prisma.class.findMany({
      include: {
        enrollments: true,
        subject: true,
      },
    });

    const adaptedClasses = classesWithSubjects.map((classes) => {
      return {
        id: classes.id,
        name: classes.name,
        teacher: classes.teacher,
        place: classes.place,
        startTime: classes.startTime,
        endTime: classes.endTime,
        maxStudents: classes.maxStudents,
        subject: {
          id: classes.subject.id,
          name: classes.subject.name,
          credits: classes.subject.credits,
        },
        enrolledStudentsCount: classes.enrollments.length,
      };
    });

    return adaptedClasses;
  }
}
