import { Transform } from 'class-transformer';

export function CastToBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    return value === 'true';
  });
}
