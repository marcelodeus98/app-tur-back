import { BaseError } from './base_error';

export class NoFoundItem extends BaseError {
  constructor(message: string) {
    super(`Nenhum registro encontrado para ${message}`);
  }
}

export class DuplicatedItem extends BaseError {
  constructor(message: string, public data?: any) {
    super(`O registro já existe para: ${message}`);
  }
}

export class ValidationFailed extends BaseError {
  constructor(
    public errorMessages: string[],
    public existingData?: any
  ) {
    super('Falha na validação dos dados');
  }
}