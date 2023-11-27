export class ServiceException extends Error {
  public description: string | null;

  constructor(message: string, description?: string) {
    super();

    this.name = ServiceException.name;
    this.message = message;
    this.description = description ?? null;
  }
}
