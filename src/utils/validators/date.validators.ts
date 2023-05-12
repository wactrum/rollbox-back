import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDateLessThanToday(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isDateLessThanToday',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `Field ${propertyName} must be less than the current date`,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return new Date(value) <= new Date();
        },
      },
    });
  };
}
