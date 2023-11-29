import { UserTokenPayloadI } from '../interfaces/auth.interface';

declare global {
  var token: string;
  var user: UserTokenPayloadI;
}

export {};
