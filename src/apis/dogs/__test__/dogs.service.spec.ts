import { Test } from '@nestjs/testing';
import { DogsService } from '../dogs.service';

const mockDogsRepository = {};

describe('DogsService', () => {
	let dogsService: DogsService;

	beforeEach(async () => {
		const dogsModule = await Test.createTestingModule({
			providers: [DogsService],
		}).compile();

		dogsService = dogsModule.get<DogsService>(DogsService);
	});

	it('dogsService가 정의되어야 함', () => {
		expect(dogsService).toBeDefined();
	});
});
