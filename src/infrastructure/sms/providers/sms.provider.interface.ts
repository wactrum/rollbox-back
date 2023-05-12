export class SendSmsDto {
  phone: string;
  message: string;
}

export abstract class SmsProvider {
  abstract send(data: SendSmsDto): Promise<void>;
  abstract getName(): string;
}
