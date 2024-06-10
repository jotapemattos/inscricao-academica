import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClassEnrollmentController } from './controllers/class-enrollment.controller';

@Module({
  imports: [],
  controllers: [ClassEnrollmentController],
  providers: [PrismaService],
})
export class AppModule {}
