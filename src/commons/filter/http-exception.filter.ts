import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const statusCode = exception.getStatus();
		const message = exception.message;

		console.log('============');
		console.log('예외가 발생했어요!');
		console.log('예외내용:', message);
		console.log('예외코드:', statusCode);
		console.log('============');

		// response.status(statusCode).json({
		// 	statusCode,
		// 	timestamp: new Date().toISOString(),
		// 	path: request.url,
		// });
	}
}
