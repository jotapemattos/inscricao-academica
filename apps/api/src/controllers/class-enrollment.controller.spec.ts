import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { ClassEnrollmentController } from './class-enrollment.controller';

// Mock PrismaService methods
const mockPrismaService = () => ({
  class: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
  },
  classEnrollment: {
    count: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  waitList: {
    create: vi.fn(),
  },
  completedSubject: {
    findFirst: vi.fn(),
  },
  prerequisite: {
    findFirst: vi.fn(),
  },
});

describe('ClassEnrollmentController', () => {
  let controller: ClassEnrollmentController;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = mockPrismaService() as unknown as PrismaService;
    controller = new ClassEnrollmentController(prisma);
  });

  it('should throw ForbiddenException if total credits exceed 20 (RN01)', async () => {
    const body = {
      studentId: 'student1',
      classId: 'class1',
    };

    prisma.class.findUnique.mockResolvedValue({
      subject: { credits: 5 },
    });

    prisma.classEnrollment.findMany.mockResolvedValue([
      { class: { subject: { credits: 18 } } },
    ]);

    await expect(controller.handle(body)).rejects.toThrow(
      new ForbiddenException(
        'Não foi possível se matricular na matéria. O aluno ultrapassou o limite de créditos.',
      ),
    );
  });

  it('should add student to waitlist if class is full (RN02)', async () => {
    const body = {
      studentId: 'student1',
      classId: 'class1',
    };

    prisma.class.findFirst.mockResolvedValue({
      maxStudents: 2,
    });

    prisma.classEnrollment.count.mockResolvedValue(2);

    const response = await controller.handle(body);

    expect(prisma.waitList.create).toHaveBeenCalledWith({
      data: {
        studentId: 'student1',
        classId: 'class1',
      },
    });

    expect(response).toEqual({ message: 'Aluno adicionado a lista de espera' });
  });
});
