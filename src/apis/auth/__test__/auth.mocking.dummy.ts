export class MockUsersRepository {
	user = [
		{
			id: '3e3f6340-1164-4b5b-a2fd-e067f180f59f',
			name: 'name1',
			email: 'a@a.com',
			password: '$2b$10$vQ5ylnvTEafMPbiFg0d2.uTudcTLspBsLzD/kKGHIhgZhAo0QxtBi',
			phone: '01011112222',
			image: null,
			createAt: '2023-03-22 12:54:33.782589',
			deleteAt: null,
			updateAt: '2023-03-22 12:54:33.782589',
		},
		{
			id: '5870ca3b-8ef1-42ea-9ded-e4b891048acd',
			name: 'name3',
			email: 'c@c.com',
			password: '$2b$10$Oc.X1iGzvpViyl8ZCUvU2ejUZFSGyVnhRBECyeLj5GSxj7VsFJPpS',
			phone: '01033334444',
			image: null,
			createAt: '2023-03-22 12:55:18.096026',
			deleteAt: null,
			updateAt: '2023-03-22 12:55:18.096026',
		},
		{
			id: '8338838b-55ff-41e3-802a-4678fb670f20',
			name: 'name5',
			email: 'e@e.com',
			password: '$2b$10$sizeluOKKWJDpGmPSi8wZ.sl4eIkXjrU1FROSDLd68ot/KewZk7Tm',
			phone: '01055556666',
			image: null,
			createAt: '2023-03-22 12:55:42.426715',
			deleteAt: null,
			updateAt: '2023-03-22 12:55:42.426715',
		},
		{
			id: 'abebfaf1-9de0-4f60-96b1-52f18fb83145',
			name: 'name4',
			email: 'd@d.com',
			password: '$2b$10$ye1JpC7Z1soOvQZmg81xCeIjcdv4R/uA77pICxIQYIESJ5FyDtsM2',
			phone: '01044445555',
			image: null,
			createAt: '2023-03-22 12:55:30.949721',
			deleteAt: null,
			updateAt: '2023-03-22 12:55:30.949721',
		},
		{
			id: 'c78b3889-ab66-4171-8c88-145ba4691e05',
			name: 'name2',
			email: 'b@b.com',
			password: '$2b$10$KHwjwmUFSTxklQnDNN6Q7.FJsfAP3S8x0wLhMbEcui6POo6PGMS5u',
			phone: '01022223333',
			image: null,
			createAt: '2023-03-22 12:55:00.381975',
			deleteAt: null,
			updateAt: '2023-03-22 12:55:00.381975',
		},
	];

	// email로 찾아오는 findOne
	findOne({ where }) {
		const _user = this.user.filter((el) => el.email === where.email);
		if (_user.length) {
			return _user[0];
		}
		return null;
	}
}
