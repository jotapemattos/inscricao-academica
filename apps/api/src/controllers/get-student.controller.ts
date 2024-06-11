import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('student')
export class GetStudentController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    return await this.prisma.student.findFirst();
  }
}
