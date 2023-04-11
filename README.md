# 팀 **깍까오독**의 **GROOMEONG** 서비스 소개 페이지입니다.

# 서비스 기획의도

![Logo-120-120](https://user-images.githubusercontent.com/120294031/228166925-5d147b8b-6ce2-4b06-a51a-bfb017f5180a.png)

1인 가구 증가, 인구 고령화에 따라 반려동물로 강아지를 키우는 사람들이 많아지면서 강아지를 위한 다양한 서비스들이 늘어나고 있습니다. 저희는 강아지를 위한 다양한 서비스 중에서 **강아지 미용샵**에 주목했습니다. 강아지 미용샵 검색 시 소비자가 원하는 **미용샵 정보**가 아닌 광고 사이트가 많아 비공식적인 커뮤니티 사이트에 의지해 미용샵을 찾아야 하는 불편함이 있었습니다.

따라서 저희는 이런 불편함을 해소하고자 _우리 동네 반려견 미용샵, 한 눈에 볼 수 없을까?_ 기획 의도에 따라 '**GROOMEONG**' 서비스를 계획하고 개발하였습니다.

> '**GROOMEONG**'은 특정 지역의 반려견 미용샵 목록을 조회하고 예약할 수 있는 서비스로, 견주들이 강아지 미용샵을 지금보다 편리하게 이용할 수 있게 하였습니다.

<br>

# 팀원 소개

![백엔드팀원](https://user-images.githubusercontent.com/56855262/230724437-9b2e02e8-0494-4d67-9618-5279f211ad83.png)

![프론트엔드팀원](https://user-images.githubusercontent.com/56855262/230724445-95c0345e-ea42-4186-b14d-1fec18b93ca0.png)

<br><br>

# 시연 GIF

## 랜딩 페이지

![랜딩페이지](https://user-images.githubusercontent.com/56855262/230727337-ea1b9559-1a25-4f1e-929b-09716419b5be.gif)

<br>

## 메인 페이지

![메인페이지](https://user-images.githubusercontent.com/56855262/230727459-67f873c0-ad23-46d8-be80-0e84fe5a973a.png)

<br>

## 로그인 & 회원가입 페이지

![로그인,회원가입페이지](https://user-images.githubusercontent.com/56855262/230727921-5e6deb4e-bbb3-4e15-848a-0a2a4542383a.gif)

<br>

## 마이 페이지

![마이페이지](https://user-images.githubusercontent.com/56855262/230728141-8543c82e-7304-4c6b-8d84-64c7b966eb67.gif)

<br>

## 강아지 페이지

![강아지페이지](https://user-images.githubusercontent.com/56855262/230728313-65d087c1-8c43-49a2-ba77-b9180120d245.gif)

<br>

## 지도 페이지

![지도페이지](https://user-images.githubusercontent.com/56855262/230729774-d378f2a6-fb21-482e-a8ef-c52ed09c50ef.gif)

<br>

## 예약 페이지

![예약페이지](https://user-images.githubusercontent.com/56855262/230730680-10e4caeb-4747-4b57-b355-66893bfa86c0.gif)

<br>

## 리뷰 페이지

![리뷰페이지](https://user-images.githubusercontent.com/56855262/230731020-bdb3d72d-aa9c-4c25-8aae-ce7a7471140b.gif)

<br><br>

# 기술 스택

![기술스텍](https://user-images.githubusercontent.com/56855262/230725266-4e02ddeb-fbc5-4979-8495-14fe02bb7f21.png)

<br><br>

# 플로우 차트

![flowChart](https://user-images.githubusercontent.com/56855262/230725563-e0a9ee53-c547-41e6-8320-c72a8852d929.png)

<br><br>

# ERD

![ERD](https://user-images.githubusercontent.com/56855262/230725343-8f257f73-5325-4185-9d09-ff847031d0fd.png)

<br><br>

# API 명세서

![API 명세서](https://user-images.githubusercontent.com/56855262/230725468-0d128b66-54c1-4c2c-a173-f32e65f5b3cb.png)

<br><br>

# 서버 폴더 구조

```md
.
└── 📂 backend /
├── 📂 elk/
│ └── 📂 logstash/
│ ├── 🧸 auto-template.json
│ ├── ⚙️ logstash.conf
│ └── 🫕 mysql-connector-java-8.0.28.jar
├── 📂 src/
│ ├── 📂 apis/
│ │ ├── 📂 auth/
│ │ │ ├── 📂 **test**/
│ │ │ │ ├── 📝 auth.mocking.dummy.ts
│ │ │ │ ├── 🛎️ auth.resolver.spec.ts
│ │ │ │ └── 🛎️ auth.service.spec.ts
│ │ │ ├── 📂 guards/
│ │ │ │ ├── 📝 dynamic-auth.guard-02.ts
│ │ │ │ └── 🔐 gql-auth.guard.ts
│ │ │ ├── 📂 interface/
│ │ │ │ └── 📝 auth.interface.ts
│ │ │ ├── 📂 streategies/
│ │ │ │ ├── 📝 jwt-access.strategy.ts
│ │ │ │ ├── 📝 jwt-refresh.stratehy.ts
│ │ │ │ ├── 📝 jwt-social-google.strategy.ts
│ │ │ │ └── 📝 jwt-social-kakao.strategy.ts
│ │ │ ├── 📝 auth.controller.ts
│ │ │ ├── 📝 auth.module.ts
│ │ │ ├── 📝 auth.resovler.ts
│ │ │ └── 📝 auth.service.ts
│ │ ├── 📂 dogs/
│ │ │ ├── 📂 **test/
│ │ │ │ └── 🛎️ dogs.resolver.spec.ts
│ │ │ ├── 📂 dto/
│ │ │ │ ├── 📝 create-dog.input
│ │ │ │ └── 📝 update-dog.input
│ │ │ ├── 📂 entities/
│ │ │ │ └── 📝 dog.entity.ts
│ │ │ ├── 📂 enum/
│ │ │ │ └── 📝 dog-type.enum.ts
│ │ │ ├── 📂 interfaces/
│ │ │ │ └── 📝 dogs-service.interface.ts
│ │ │ ├── 📝 dogs.module.ts
│ │ │ ├── 📝 dogs.resolver.ts
│ │ │ └── 📝 dogs.service.ts
│ │ ├── 📂 files/
│ │ │ ├── 📂 interfaces/
│ │ │ │ └── 📝 files-service.interface
│ │ │ ├── 📝 files.module.ts
│ │ │ ├── 📝 files.resolver.ts
│ │ │ └── 📝 files.service.ts
│ │ ├── 📂 reservations/
│ │ │ ├── 📂 dto/
│ │ │ │ └── 📝 create-reservation.input.ts
│ │ │ ├── 📂 entities/
│ │ │ │ └── 📝 reservation.entity.ts
│ │ │ ├── 📂 interfaces
│ │ │ ├── 📝 reservation.module.ts
│ │ │ ├── 📝 reservation.resolver.ts
│ │ │ └── 📝 reservation.service.ts
│ │ ├── 📂 reviews/
│ │ │ ├── 📂 dto/
│ │ │ │ └── 📝 create-review.input.ts
│ │ │ ├── 📂 entities/
│ │ │ │ └── 📝 review.entity.ts
│ │ │ ├── 📂 interfaces/
│ │ │ │ └── 📝 reviews-service.interface.ts
│ │ │ ├── 📝 reviews.module.ts
│ │ │ ├── 📝 reviews.resolver.ts
│ │ │ └── 📝 reviews.service.ts
│ │ ├── 📂 shop-review/
│ │ │ ├── 📂 dto/
│ │ │ │ └── 📝 return-shop-review.output
│ │ │ ├── 📝 shop-review.module.ts
│ │ │ ├── 📝 shop-review.resolver.ts
│ │ │ └── 📝 shop-review.service.ts
│ │ ├── 📂 shopImages/
│ │ │ ├── 📂 **test**/
│ │ │ │ ├── 📝 shopImage.moking.dummy.ts
│ │ │ │ ├── 🛎️ shopImage.resolver.spec.ts
│ │ │ │ └── 🛎️ shopImage.service.spec.ts
│ │ │ ├── 📂 dto/
│ │ │ │ ├── 📝 save-shopImage.input.ts
│ │ │ │ └── 📝 update-shopImage.input.ts
│ │ │ ├── 📂 entities/
│ │ │ │ └── 📝 shopImages.entity.ts
│ │ │ ├── 📂 interfaces/
│ │ │ │ └── 📝 shopImages-service.interface.ts
│ │ │ ├── 📝 shopImage.module.ts
│ │ │ ├── 📝 shopImage.resolver.ts
│ │ │ └── 📝 shopImage.service.ts
│ │ ├── 📂 shops/
│ │ │ ├── 📂 **test**/
│ │ │ │ └── 🛎️ shops.service.spec.ts
│ │ │ ├── 📂 dto/
│ │ │ │ ├── 📝 create-shop.input.ts
│ │ │ │ ├── 📝 return-shop.output.ts
│ │ │ │ └── 📝 update-shop.input.ts
│ │ │ ├── 📂 entities/
│ │ │ │ └── 📝 shop.entity.ts
│ │ │ ├── 📂 interfaces/
│ │ │ │ └── 📝 shops-service.interface.ts
│ │ │ ├── 📝 shops.module.ts
│ │ │ ├── 📝 shops.resolver.ts
│ │ │ └── 📝 shops.service.ts
│ │ └── 📂 users/
│ │ ├── 📂 **test\_\_/
│ │ │ └── 🛎️ users.service.spec.ts
│ │ ├── 📂 dto/
│ │ │ ├── 📝 create-users.input.ts
│ │ │ └── 📝 update-users.input.ts
│ │ ├── 📂 entities/
│ │ │ └── 📝 user.entity.ts
│ │ ├── 📂 interface/
│ │ │ └── 📝 users.interface.ts
│ │ ├── 📝 user.module.ts
│ │ ├── 📝 user.resolver.ts
│ │ └── 📝 user.service.ts
│ ├── 📂 commons/
│ │ ├── 📂 filter/
│ │ │ └── 📝 http-exception.filter.ts
│ │ ├── 📂 interface/
│ │ │ └── 📝 context.ts
│ │ └── 📂 utils/
│ │ ├── 📝 addresscode.ts
│ │ └── 📝 utils.ts
│ ├── 📂 test/
│ │ ├── 🛎️ app.e2e-spec.ts
│ │ └── 🧸 jest-e2e.json
│ ├── 📝 app.controller.ts
│ ├── 📝 app.module.ts
│ └── 📝 main.ts
├── 📝 .eslintrc.js
├── 📝 .gitignore
├── 📝 .prettierrc
├── 🐳 .dockerignore
├── 🐳 docker-compose.prod.yaml
├── 🐳 docker-compose.yaml
├── 🐳 Dockerfile
├── 🐳 Dockerfile.elasticsearch
├── 🐳 Dockerfile.logstash
├── 🐳 Dockerfile.prod
├── 🧸 nest-cli.json
├── 🧸 package.json
├── 📝 README.md
├── 🧸 settings.json
├── 🧸 tsconfig.build.json
├── 🧸 tsconfig.json
├── 📝 yarn-error.log
└── 📝 yarn.lock
```
