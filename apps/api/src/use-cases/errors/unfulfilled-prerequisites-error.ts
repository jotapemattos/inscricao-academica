export class UnfulfilledPrerequisitesError extends Error {
  constructor() {
    super(
      'Não foi possível se matricular na matéria. Você não completou os pré-requisitos para matricular-se',
    );
  }
}
