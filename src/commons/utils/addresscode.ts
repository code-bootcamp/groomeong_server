export function districtCode({ district }) {
	const addressCodes = [
		{
			properties: {
				code: 11250,
				name: '강동구',
			},
		},
		{
			properties: {
				code: 11240,
				name: '송파구',
			},
		},
		{
			properties: {
				code: 11230,
				name: '강남구',
			},
		},
		{
			properties: {
				code: 11220,
				name: '서초구',
			},
		},
		{
			properties: {
				code: 11210,
				name: '관악구',
			},
		},
		{
			properties: {
				code: 11200,
				name: '동작구',
			},
		},
		{
			properties: {
				code: 11190,
				name: '영등포구',
			},
		},
		{
			properties: {
				code: 11180,
				name: '금천구',
			},
		},
		{
			properties: {
				code: 11170,
				name: '구로구',
			},
		},
		{
			properties: {
				code: 11160,
				name: '강서구',
			},
		},
		{
			properties: {
				code: 11150,
				name: '양천구',
			},
		},
		{
			properties: {
				code: 11140,
				name: '마포구',
			},
		},
		{
			properties: {
				code: 11130,
				name: '서대문구',
			},
		},
		{
			properties: {
				code: 11120,
				name: '은평구',
			},
		},
		{
			properties: {
				code: 11110,
				name: '노원구',
			},
		},
		{
			properties: {
				code: 11100,
				name: '도봉구',
			},
		},
		{
			properties: {
				code: 11090,
				name: '강북구',
			},
		},
		{
			properties: {
				code: 11080,
				name: '성북구',
			},
		},
		{
			properties: {
				code: 11070,
				name: '중랑구',
			},
		},
		{
			properties: {
				code: 11060,
				name: '동대문구',
			},
		},
		{
			properties: {
				code: 11050,
				name: '광진구',
			},
		},
		{
			properties: {
				code: 11040,
				name: '성동구',
			},
		},
		{
			properties: {
				code: 11030,
				name: '용산구',
			},
		},
		{
			properties: {
				code: 11020,
				name: '중구',
			},
		},
		{
			properties: {
				code: 11010,
				name: '종로구',
			},
		},
	];
	const targetDistrict = addressCodes.find(
		(item) => item.properties.name === district,
	);
	// find() 메소드를 사용해 주소 코드 배열에서 name 속성 값이 입력한 district와 일치하는 객체를 찾음
	if (targetDistrict) {
		return targetDistrict.properties.code;
	} else {
		return null; // 일치하는 객체가 없는 경우 null 반환
	}
}
