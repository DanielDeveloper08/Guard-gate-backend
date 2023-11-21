import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import { compile as hbsCompile } from 'handlebars';

export class TemplateHelper {
  private readonly basePath: string = 'src/views';

  async generate(template: string, context: object): Promise<string | null> {
    try {
      const templatePath = `${this.basePath}/${template}.hbs`;

      if (!existsSync(templatePath)) return null;

      const content = await fs.readFile(templatePath, 'utf-8');
      const compile = hbsCompile(content);
      const rawHtml = compile(context);

      return rawHtml;
    } catch (_) {
      return null;
    }
  }
}
