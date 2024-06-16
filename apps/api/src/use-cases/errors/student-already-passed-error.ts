export class StudentAlreadyPassedError extends Error {
  constructor() {
    super(
      'Não foi possível se matricular na matéria. Você já completou essa disciplina.',
    );
  }
}
