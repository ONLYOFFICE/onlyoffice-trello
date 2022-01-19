import {
  ArgumentsHost, Catch, ExceptionFilter, NotFoundException,
} from '@nestjs/common';

/**
 * 404 Redirect to https://trello.com handler
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(_: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.redirect('https://trello.com');
  }
}
