import { AuthTypeEnum } from '../enums/auth.enum';

interface MailPayloadI {
  to: string;
}

export interface TwoStepAuthMailI extends MailPayloadI {
  fullname: string;
  code: string;
  type: AuthTypeEnum;
}
