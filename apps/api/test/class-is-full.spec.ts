import { InMemoryClassEnrollmentRepository } from '@/repositories/in-memory/in-memory-class-enrollment-repository';
import { ClassEnrollmentUseCase } from '@/use-cases/class-enrollment-use-case';
import { expect, describe, it, beforeEach } from 'vitest';

let classEnrollmentRepository: InMemoryClassEnrollmentRepository;
let classEnrollmentUseCase: ClassEnrollmentUseCase;

describe('O estudante pode entrar na lista de espera quando a turma estiver cheia', () => {
  beforeEach(() => {
    classEnrollmentRepository = new InMemoryClassEnrollmentRepository();
    classEnrollmentUseCase = new ClassEnrollmentUseCase(
      classEnrollmentRepository,
    );
  });

  it('should add student in the waitList when class is full', async () => {
    await classEnrollmentRepository.addSubject({
      id: 689,
      name: 'Qualidade de Software',
      credits: 4,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-1',
      name: '5 Semestre',
      place: 'A404',
      maxStudents: 20,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 689,
    });
    for (let i = 0; i < 20; i++) {
      await classEnrollmentRepository.addStudent({
        id: `id-${i}`,
        name: `Aluno ${i}`,
        email: `aluno${i}@gmail.com`,
        password: '321',
      });
      await classEnrollmentRepository.addEnrollment({
        classId: 'id-1',
        studentId: `id${i}`,
      });
    }

    await classEnrollmentRepository.addStudent({
      id: 'id-selecionado',
      name: 'Joao Pedro',
      email: 'jp@gmail.com',
      password: '321',
    });
    await classEnrollmentRepository.addEnrollment({
      classId: 'id-1',
      studentId: 'id-selecionado',
    });

    const response = await classEnrollmentUseCase.execute({
      classId: 'id-1',
      studentId: 'id-selecionado',
    });
    expect(response.waitList).toHaveProperty('studentId', 'id-selecionado');
    expect(response.waitList).toHaveProperty('classId', 'id-1');
  });

  it('should enroll student when there is at least 1 spot left (analise de valor limite)', async () => {
    await classEnrollmentRepository.addSubject({
      id: 689,
      name: 'Qualidade de Software',
      credits: 4,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-1',
      name: '5 Semestre',
      place: 'A404',
      maxStudents: 20,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 689,
    });
    for (let i = 1; i <= 19; i++) {
      await classEnrollmentRepository.addStudent({
        id: `id-${i}`,
        name: `Aluno ${i}`,
        email: `aluno${i}@gmail.com`,
        password: '321',
      });
      await classEnrollmentRepository.addEnrollment({
        classId: 'id-1',
        studentId: `id-${i}`,
      });
    }

    await classEnrollmentRepository.addStudent({
      id: 'id-selecionado',
      name: 'Joao Pedro',
      email: 'jp@gmail.com',
      password: '321',
    });

    const response = await classEnrollmentUseCase.execute({
      classId: 'id-1',
      studentId: 'id-selecionado',
    });
    expect(response.classEnrollment).toHaveProperty(
      'studentId',
      'id-selecionado',
    );
    expect(response.classEnrollment).toHaveProperty('classId', 'id-1');
  });

  it('should enroll student when class is empty (analise de valor limite)', async () => {
    await classEnrollmentRepository.addSubject({
      id: 689,
      name: 'Qualidade de Software',
      credits: 4,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-1',
      name: '5 Semestre',
      place: 'A404',
      maxStudents: 20,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 689,
    });

    await classEnrollmentRepository.addStudent({
      id: 'id-selecionado',
      name: 'Joao Pedro',
      email: 'jp@gmail.com',
      password: '321',
    });

    const response = await classEnrollmentUseCase.execute({
      classId: 'id-1',
      studentId: 'id-selecionado',
    });
    expect(response.classEnrollment).toHaveProperty(
      'studentId',
      'id-selecionado',
    );
    expect(response.classEnrollment).toHaveProperty('classId', 'id-1');
  });
});
