export class BaseError extends Error {
  private readonly _message: string;

  constructor(message: string, data?: any) {
    super(message);
    this._message = message;
  }

  get message(): string {
    return this._message;
  }
}