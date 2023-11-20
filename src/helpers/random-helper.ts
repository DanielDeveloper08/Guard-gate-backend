import crypto from 'node:crypto';

export class RandomHelper {

  private secureRandomNumber(max: number) {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32LE(0);

    return (randomNumber / 0xffffffff) * max;
  }

  public generateCharacters(option: 'num' | 'alpha', lengthChar: number = 6) {
    try {
      const chars =
        option === 'num'
          ? '0123456789'
          : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      const randomChars = Array(lengthChar)
        .fill(chars)
        .map((x: string) => x[Math.floor(this.secureRandomNumber(x.length))])
        .join('');

      return randomChars;
    } catch (_) {
      return 'q0_1234_ab2q';
    }
  }
}
