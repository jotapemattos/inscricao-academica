import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('subjects')
export class GetSubjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    return await this.prisma.class.findMany({
      include: {
        subject: true,
      },
    });
  }
}
