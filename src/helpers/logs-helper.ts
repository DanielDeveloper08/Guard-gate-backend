import path from 'path';
import { existsSync } from 'fs';
import fs from 'fs/promises';

export class LogsHelper {
  private readonly _dir = path.join(process.cwd(), 'logs');

  constructor() {
    this.createDir();
  }

  private createDir(): void {
    if (!existsSync(this._dir)) {
      fs.mkdir(this._dir, { recursive: true });
    }
  }

  public error(message: unknown): void {
    const dateStr = new Date().toLocaleString('es-EC');

    const currentDay = new Date()
      .toLocaleDateString('es-EC')
      .replace(/\//g, '_');

    const fileName = `errors-${currentDay}.log`;
    const filePath = path.join(this._dir, fileName);

    const content = `${dateStr} - ${message}\n`;

    fs.appendFile(filePath, content).then();
  }
}
