import * as dotenv from 'dotenv';

export class Environments {
  private readonly _envPath: string;

  constructor() {
    this._envPath = this.createPathEnv(this.nodeEnv);

    dotenv.config({
      path: this._envPath,
    });
  }

  public getEnv(key: string): string | null {
    return process.env[key] ?? null;
  }

  public getNumberEnv(key: string): number | null {
    const value = this.getEnv(key);

    if (!value || isNaN(Number(value))) {
      return null;
    }

    return Number(value);
  }

  public getBoolEnv(key: string): boolean {
    const value = this.getEnv(key);
    if (!value) return false;

    return value.toLowerCase() === 'true';
  }

  public get nodeEnv(): string {
    return this.getEnv('NODE_ENV')?.trim() ?? '';
  }

  private createPathEnv(path: string): string {
    const arrEnv = ['env'];

    if (path.length > 0) {
      const stringToArray = path.split('.');
      arrEnv.unshift(...stringToArray);
    }

    return '.' + arrEnv.join('.');
  }
}
