import crypto from 'crypto-js';
import { Environments } from '../config/environments';

export class EncryptorHelper extends Environments {
  private readonly _key: string;
  private readonly _iv: string;

  constructor() {
    super();
    this._key = this.getEnv('KEY_CRYPTO')!;
    this._iv = this.getEnv('IV_CRYPTO')!;
  }

  public encrypt(text: string): string {
    const key = crypto.enc.Utf8.parse(this._key);
    const iv = crypto.enc.Utf8.parse(this._iv);
    const encryptedCP = crypto.AES.encrypt(text, key, { iv });

    return encryptedCP.toString();
  }

  public decrypt(cryptText: string): string {
    const key = crypto.enc.Utf8.parse(this._key);
    const iv = crypto.enc.Utf8.parse(this._iv);
    const cipherParams = crypto.lib.CipherParams.create({
      ciphertext: crypto.enc.Base64.parse(cryptText),
    });

    const decryptedFromText = crypto.AES.decrypt(cipherParams, key, { iv });
    return decryptedFromText.toString(crypto.enc.Utf8);
  }
}
