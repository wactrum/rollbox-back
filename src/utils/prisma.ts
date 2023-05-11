import { NotFoundException } from '@nestjs/common';

export async function findUniqueWithException(model, options) {
  const result = await model.findUnique(options);

  if (!result) {
    throw new NotFoundException(`Record not found`);
  }

  return result;
}

export async function findWithException(model, options) {
  const result = await model.find(options);

  if (!result) {
    throw new NotFoundException(`Record not found`);
  }

  return result;
}
