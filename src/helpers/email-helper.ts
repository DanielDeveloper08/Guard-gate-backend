import nodemailer, { Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-connection';
import { Environments } from '../config/environments';

export class EmailHelper extends Environments {
  private readonly _transporter: Transporter;
  private readonly _options: Options;

  constructor() {
    super();
    this._options = {
      host: this.getEnv('MAIL_HOST')!,
      port: this.getNumberEnv('MAIL_PORT')!,
      secure: false,
      ignoreTLS: true,
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
        from: '"Fred Foo 👻" <dofiveh258@ikanid.com>',
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
}
