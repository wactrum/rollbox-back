import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({ default: 400 })
  statusCode: 400;

  @ApiProperty({
    isArray: true,
    anyOf: [{ type: 'array', items: { type: 'string' } }, { type: 'string' }],
  })
  message: string;

  @ApiProperty()
  error: string;
}
