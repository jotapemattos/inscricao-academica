import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClassEnrollmentController } from './controllers/class-enrollment.controller';
import { GetSubjectsController } from './controllers/get-subjects.controller';
import { GetStudentController } from './controllers/get-student.controller';
import { GetClassEnrollmentsByStudentController } from './controllers/get-enrollment-classes-by-student.controller';

@Module({
  imports: [],
  controllers: [
    ClassEnrollmentController,
    GetSubjectsController,
    GetStudentController,
    GetClassEnrollmentsByStudentController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
