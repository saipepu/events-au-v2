import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBooleanOrString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBooleanOrString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'boolean' || typeof value === 'string';
        },
        defaultMessage(args: ValidationArguments) {
          return 'Answer must be a boolean or a string';
        },
      },
    });
  };
}
