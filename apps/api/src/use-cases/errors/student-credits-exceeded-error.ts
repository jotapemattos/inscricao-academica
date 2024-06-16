export class StudentCreditsExceededError extends Error {
  constructor() {
    super(
      'Não foi possível se matricular na matéria. Você já excedeu o limite de 20 créditos.',
    );
  }
}
