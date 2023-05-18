import { BadRequestException, ValidationError } from '@nestjs/common';

export default (errors: ValidationError[]) =>
  new BadRequestException(errors.map((el) => ({ key: el.property, errors: el.constraints })));
