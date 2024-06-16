export class ScheduleConflitError extends Error {
  constructor() {
    super(
      'Não foi possível se matricular na matéria. Você já possui uma aula nesse horário.',
    );
  }
}
