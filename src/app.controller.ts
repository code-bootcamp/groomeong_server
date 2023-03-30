import { Controller, Get, HttpException, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

@Controller()
// @UseFilters()
export class AppController {
	@Get('/')
	getHello() {
		// throw new HttpException('Bad Request', 400);
		return '안녕하세요!';
	}
}
