import {
  registerDecorator, ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

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

@ValidatorConstraint({ name: 'IsDateGreaterThan', async: false })
export class IsDateGreaterThan implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    if (relatedValue === undefined || value === undefined) {
      return true;
    }
    return value >= relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `The date must be greater than or equal to ${relatedPropertyName}`;
  }
}
