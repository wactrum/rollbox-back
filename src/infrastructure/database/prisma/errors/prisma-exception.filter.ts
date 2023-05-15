import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpAdapterHost } from '@nestjs/core';

type ErrorHandler = (error: Prisma.PrismaClientKnownRequestError) => {
  message: string;
  status: number;
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  errorHandlers: Map<string, ErrorHandler> = new Map([
    // [
    //   'P2000',
    //   (error) => ({
    //     message: `The provided data for %% is invalid.`,
    //     status: 400,
    //   }),
    // ],
    [
      'P2001',
      (error) => ({
        message: `The requested record for %% does not exist.`,
        status: 404,
      }),
    ],
    [
      'P2002',
      (error) => ({
        message: `A record with the same %% already exists.`,
        status: 409,
      }),
    ],
    [
      'P2003',
      (error) => ({
        message: `The record cannot be created because it references a non-existing record (${this.extractFieldName(
          error
        )}).`,
        status: 400,
      }),
    ],
    [
      'P2004',
      (error) => ({
        message: `The operation could not be performed due to data constraints.`,
        status: 400,
      }),
    ],
    [
      'P2025',
      (error) => ({
        message: `Record to update not found`,
        status: 404,
      }),
    ],
    // Add more error handlers here
  ]);
  message = 'A server error has occurred.';
  status = 500;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  extractFieldName = (error: Prisma.PrismaClientKnownRequestError) => {
    const fieldNameWithSuffix = error.meta?.field_name as string;
    const parts = fieldNameWithSuffix.split('_');
    return parts[parts.length - 2];
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const handler = this.errorHandlers.get(exception.code);
    if (handler) {
      const result = handler(exception);
      this.message = result.message;
      this.status = result.status;
    }

    const responseBody = {
      statusCode: this.status,
      message: this.message,
      error: 'Bad data',
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, this.status);
  }
}
