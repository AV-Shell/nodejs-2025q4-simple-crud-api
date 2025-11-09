export class MyCustomError extends Error {
  public readonly myErrStatus: number | undefined;

  constructor(message = 'Error', status = 404) {
    super(message);
    this.myErrStatus = status;
  }
}
