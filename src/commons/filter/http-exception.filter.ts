import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest();
		const status = exception.getStatus();
		// const message = exception.message;
		const message = exception.message || 'Unexpected error occurred';
		const timestamp = new Date().toLocaleString('en-US', {
			timeZone: 'Asia/Seoul',
		});

		console.log('============');
		console.log('예외가 발생했어요!');
		console.log('예외내용:', message);
		console.log('예외코드:', status);
		console.log('============');

		response.status(status).json({
			status,
			timestamp,
			message,
			path: request.url,
		});
	}
}
