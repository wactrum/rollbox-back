export class UserConfirmedEvent {
  userId: number;
  phone: string;

  constructor({ userId, phone }: { userId: number; phone: string }) {
    this.userId = userId;
    this.phone = phone;
  }
}
