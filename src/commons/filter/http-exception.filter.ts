import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const httpCtx = ctx as HttpArgumentsHost;
		const response = httpCtx.getResponse();
		const request = httpCtx.getRequest();
		const status = exception.getStatus();
		const message = exception.message || 'Unexpected error occurred';
		const timestamp = new Date().toLocaleString('en-US', {
			timeZone: 'Asia/Seoul',
		});

		console.log('============');
		console.log('예외가 발생했어요!');
		console.log('예외내용:', message);
		console.log('예외코드:', status);
		console.log('============');

		// response.status(status).json({
		// 	status,
		// 	timestamp,
		// 	message,
		// 	path: request.url,
		// });
	}
}
