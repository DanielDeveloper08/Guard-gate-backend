import CryptoJS from 'crypto-js';
import { Environments } from '../config/environments';

export class EncryptorHelper extends Environments {
  private readonly _key: string;
  private readonly _iv: string;

  constructor() {
    super();
    this._key = this.getEnv('KEY_CRYPTO')!;
    this._iv = this.getEnv('IV_CRYPTO')!;
  }

  private getKey(): CryptoJS.lib.WordArray {
    const bytes = CryptoJS.enc.Utf8.parse(this._key.padEnd(32, '0'));
    return CryptoJS.lib.WordArray.create(bytes.words, 16);
  }

  private getIV(): CryptoJS.lib.WordArray {
    const bytes = CryptoJS.enc.Utf8.parse(this._iv.padEnd(32, '0'));
    return CryptoJS.lib.WordArray.create(bytes.words, 16);
  }

  public encrypt(text: string): string {
    const key = this.getKey();
    const iv = this.getIV();

    const cipherText = CryptoJS.AES.encrypt(text, key, { iv });
    return cipherText.toString();
  }

  public decrypt(cryptText: string): string {
    const key = this.getKey();
    const iv = this.getIV();

    const bytesDecrypted = CryptoJS.AES.decrypt(cryptText, key, { iv });
    return bytesDecrypted.toString(CryptoJS.enc.Utf8);
  }
}
