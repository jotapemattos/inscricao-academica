import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClassEnrollmentController } from './controllers/class-enrollment.controller';
import { GetSubjectsController } from './controllers/get-subjects.controller';
import { GetStudentController } from './controllers/get-student.controller';

@Module({
  imports: [],
  controllers: [
    ClassEnrollmentController,
    GetSubjectsController,
    GetStudentController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
