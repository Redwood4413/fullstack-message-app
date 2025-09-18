import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    res.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      cause: exception.cause,
      message: exception.message,
    });
  }
}
