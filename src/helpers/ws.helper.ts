import axios, { AxiosHeaders } from 'axios';
import { Environments } from '../config/environments';
import { SendMessageI } from '../interfaces/ws.interface';

export class WsHelper extends Environments {
  private readonly _BASE_URL: string;
  private readonly _phoneId: string;
  private readonly _accessToken: string;

  constructor() {
    super();
    this._BASE_URL = this.getEnv('WS_BASE_URL')!;
    this._phoneId = this.getEnv('WS_PHONE_NUMBER_ID')!;
    this._accessToken = this.getEnv('WS_ACCESS_TOKEN')!;
  }

  private formatPhoneNumber(phone: string, prefix: string = '593') {
    if (phone.startsWith('0')) {
      return prefix.concat(phone.slice(1));
    }

    return phone;
  }

  private parseBody(payload: SendMessageI) {
    const { visitorName, visitorPhone, residentName, imgUrl } = payload;

    return {
      messaging_product: 'whatsapp',
      to: this.formatPhoneNumber(visitorPhone),
      type: 'template',
      template: {
        name: 'guard_gate_app_qr',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: imgUrl,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: visitorName,
              },
              {
                type: 'text',
                text: residentName,
              },
            ],
          },
        ],
      },
    };
  }

  async sendMessage(payload: SendMessageI): Promise<[unknown, boolean]> {
    try {
      const data = this.parseBody(payload);

      const headers = new AxiosHeaders().setAuthorization(
        `Bearer ${this._accessToken}`
      );

      const res = await axios.post(
        `${this._BASE_URL}/${this._phoneId}/messages`,
        data,
        { headers }
      );

      return [res.data, false];
    } catch (error) {
      return [null, true];
    }
  }
}
