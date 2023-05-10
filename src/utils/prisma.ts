import { NotFoundException } from '@nestjs/common';

export async function findUniqueWithException(model, options) {
  const result = await model.findUnique(options);

  if (!result) {
    throw new NotFoundException(`Record not found`);
  }

  return result;
}