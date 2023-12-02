import nodemailer, { Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-connection';
import { Environments } from '../config/environments';
import { TemplateHelper } from './template-helper';
import { TwoStepAuthMailI } from '../interfaces/email.interface';

export class EmailHelper extends Environments {
  private readonly _transporter: Transporter;
  private readonly _options: Options;

  constructor(
    private readonly _template = new TemplateHelper(),
  ) {
    super();
    this._options = {
      host: this.getEnv('MAIL_HOST')!,
      port: this.getNumberEnv('MAIL_PORT')!,
      auth: {
        user: this.getEnv('MAIL_USER')!,
        pass: this.getEnv('MAIL_PASSWORD')!,
      },
    };

    this._transporter = nodemailer.createTransport(this._options);
  }

  async send() {
    try {
      const info = await this._transporter.sendMail({
        from: 'GuardGateApp.com',
        to: 'josemidev24@gmail.com',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>',
      });

      console.log('Message sent:', info);
    } catch (error) {
      console.error('Error al enviar email:', error);
    }
  }

  async sendTwoStepAuth(
    payload: TwoStepAuthMailI
  ): Promise<[unknown, boolean]> {
    try {
      const template = await this._template.generate('two_step_auth', payload);

      if (!template) return [null, false];

      await this._transporter.sendMail({
        from: '"GuardGateApp.com" <guardgate@younet.ec>',
        to: payload.to,
        subject: `${payload.type.toUpperCase()} - GuardGateApp`,
        html: template,
      });

      return [null, true];
    } catch (error) {
      return [error, false];
    }
  }
}
