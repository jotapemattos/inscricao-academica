import { InMemoryClassEnrollmentRepository } from '@/repositories/in-memory/in-memory-class-enrollment-repository';
import { ClassEnrollmentUseCase } from '@/use-cases/class-enrollment-use-case';
import { StudentCreditsExceededError } from '@/use-cases/errors/student-credits-exceeded-error';
import { expect, describe, it, beforeEach } from 'vitest';

// classEnrollmentRepository faz referencia a uma simulacao de banco aplicado em memoria, para que o teste unitario nao se comunique diretamente com o banco de dados
let classEnrollmentRepository: InMemoryClassEnrollmentRepository;
let classEnrollmentUseCase: ClassEnrollmentUseCase;

describe('O estudante não possui créditos suficientes para se cadastrar na disciplina', () => {
  beforeEach(() => {
    classEnrollmentRepository = new InMemoryClassEnrollmentRepository();
    classEnrollmentUseCase = new ClassEnrollmentUseCase(
      classEnrollmentRepository,
    );
  });

  // valor limite inferior da classe inválida. soma de créditos resulta em 21
  it('should return an error if student`s credit limit is exceeded', async () => {
    await classEnrollmentRepository.addStudent({
      id: 'id-usuario',
      name: 'Joao Pedro',
      email: 'jpmrc49@gmail.com',
      password: '321',
    });

    for (let i = 1; i <= 5; i++) {
      await classEnrollmentRepository.addSubject({
        id: i,
        name: `Disciplina ${i}`,
        credits: 4,
      });
      await classEnrollmentRepository.addClass({
        id: `${i}`,
        name: '5 Semestre',
        place: `A40${i}`,
        maxStudents: 2,
        teacher: `Professor ${i + 1}`,
        startTime: new Date(),
        endTime: new Date(),
        subjectId: i,
      });
      await classEnrollmentRepository.addEnrollment({
        classId: `${i}`,
        studentId: 'id-usuario',
      });
    }

    await classEnrollmentRepository.addSubject({
      id: 584390,
      name: 'Disciplina selecionada',
      credits: 1,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-selecionado',
      name: '5 Semestre',
      place: 'A405',
      maxStudents: 2,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 584390,
    });

    await expect(() =>
      classEnrollmentUseCase.execute({
        classId: 'id-selecionado',
        studentId: 'id-usuario',
      }),
    ).rejects.toBeInstanceOf(StudentCreditsExceededError);
  });

  // soma de créditos é exatamente 20 (classe no limite)
  it('should enroll student if credits sum is equal to 20', async () => {
    await classEnrollmentRepository.addStudent({
      id: 'id-usuario',
      name: 'Joao Pedro',
      email: 'jpmrc49@gmail.com',
      password: '321',
    });

    for (let i = 1; i <= 4; i++) {
      await classEnrollmentRepository.addSubject({
        id: i,
        name: `Disciplina ${i}`,
        credits: 4,
      });
      await classEnrollmentRepository.addClass({
        id: `${i}`,
        name: '5 Semestre',
        place: `A40${i}`,
        maxStudents: 2,
        teacher: `Professor ${i + 1}`,
        startTime: new Date(),
        endTime: new Date(),
        subjectId: i,
      });
      await classEnrollmentRepository.addEnrollment({
        classId: `${i}`,
        studentId: 'id-usuario',
      });
    }

    await classEnrollmentRepository.addSubject({
      id: 584390,
      name: 'Disciplina selecionada',
      credits: 4,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-selecionado',
      name: '5 Semestre',
      place: 'A405',
      maxStudents: 2,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 584390,
    });

    const response = await classEnrollmentUseCase.execute({
      classId: 'id-selecionado',
      studentId: 'id-usuario',
    });
    expect(response.classEnrollment).toHaveProperty('studentId', 'id-usuario');
    expect(response.classEnrollment).toHaveProperty(
      'classId',
      'id-selecionado',
    );
  });

  // classe vazia. soma de créditos é 0, portanto ele deve conseguir se matricular
  it('should enroll student if credits sum is equal to 0', async () => {
    await classEnrollmentRepository.addStudent({
      id: 'id-usuario',
      name: 'Joao Pedro',
      email: 'jpmrc49@gmail.com',
      password: '321',
    });

    await classEnrollmentRepository.addSubject({
      id: 584390,
      name: 'Disciplina selecionada',
      credits: 4,
    });
    await classEnrollmentRepository.addClass({
      id: 'id-selecionado',
      name: '5 Semestre',
      place: 'A405',
      maxStudents: 2,
      teacher: 'Vendramel',
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 584390,
    });

    const response = await classEnrollmentUseCase.execute({
      classId: 'id-selecionado',
      studentId: 'id-usuario',
    });
    expect(response.classEnrollment).toHaveProperty('studentId', 'id-usuario');
    expect(response.classEnrollment).toHaveProperty(
      'classId',
      'id-selecionado',
    );
  });
});
