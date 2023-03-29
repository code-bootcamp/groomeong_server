# TEAM VIEWPOINT

![Logo-120-120](https://user-images.githubusercontent.com/120294031/228166925-5d147b8b-6ce2-4b06-a51a-bfb017f5180a.png)

<br><br>

# GROOMEONG

동네 공원을 나가면 강아지 산책하시는 분들이 대다수이고, 반려동물들을 많이 키우는 트랜드에 맞춰서
강아지 호텔, 강아지 수영장, 강아지 펫샵 ,강아지 미용샵 등등 다양한 서비스들이 늘어나고 있습니다.
강아지 미용샵 검색 시 , 소비자가 원하는 '샵 정보' 보다는 홍보 사이트가 많아 비공식적인 커뮤니티 사이트에 의지해 업체를 찾아야 한다. 그래서 저희가 개발을 한 웹 어플리케이션이 있다!!!
저희 '**GROOMENOG**' 강아지 미용샵을 견주들이 더 편리하게 이용 할 수 있도록 하기 위한 특정 지역들에 반려견 미용업체 목록을 한 번에 볼 수 있는 서비스입니다. 🐶

### 반짝이는 별 같은 댕댕이 🐶🧡

반려견의 뷰티를 위한 웹 게더🐶 '**그루멍**'

<br><br>

# 팀원 소개

| 이름       | 역할         | 담당 부분 |
| ---------- | ------------ | --------- |
| **홍예림** | 팀장, 백엔드 |           |
| 김태윤     | 백엔드       |           |
| 조주현     | 백엔드       |           |
| 허광기     | 프론트엔드   |           |
| 길재훈     | 프론트엔드   |           |
| 권현재     | 프론트엔드   |           |
| 김하은     | 프론트엔드   |           |

<br><br>

# 기술 스텍

![기술스텍](https://user-images.githubusercontent.com/120294031/228167268-0cd1a98d-4568-4dac-ab82-673c94c2b982.png)

<br><br>

# Flow Chart

![DBflowChart](https://user-images.githubusercontent.com/120294031/228220540-12e5d386-68f5-46b0-bce8-3d92ba8d380a.png)

<br><br>

# ERD

![ERD](https://user-images.githubusercontent.com/120294031/228168194-e25c95fa-189b-406f-9a65-962326300e0d.png)

<br><br>

# API 명세서

<img width="938" alt="기능명세서" src="https://user-images.githubusercontent.com/120294031/228170762-a44aef66-22ea-43c5-b245-e6631d49aead.png">

<br><br>

# 서버 폴더 구조

```
.
└── 📂 backend /
    ├── 📂 .vscode/
    │   └── 🧸 settings.json
    ├── 📂 elk/
    │   └── 📂 logstash/
    │       ├── 🧸 auto-template copy.json
    │       ├── 🧸 auto-template.json
    │       ├── 🧸 auto-template2.json
    │       ├── ⚙️ logstash.conf
    │       └── 🫕 mysql-connector-java-8.0.28.jar
    ├── 📂 src/
    │   ├── 📂 apis/
    │   │   ├── 📂 auth/
    │   │   │   ├── 📂 __test__/
    │   │   │   │   ├── 📝 auth.mocking.dummy.ts
    │   │   │   │   ├── 🛎️ auth.resolver.spec.ts
    │   │   │   │   └── 🛎️ auth.service.spec.ts
    │   │   │   ├── 📂 guards/
    │   │   │   │   ├── 📝 dynamic-auth.guard-02.ts
    │   │   │   │   └── 🔐 gql-auth.guard.ts
    │   │   │   ├── 📂 interface/
    │   │   │   │   └── 📝 auth.interface.ts
    │   │   │   ├── 📂 streategies/
    │   │   │   │   ├── 📝 jwt-access.strategy.ts
    │   │   │   │   ├── 📝 jwt-refresh.stratehy.ts
    │   │   │   │   ├── 📝 jwt-social-google.strategy.ts
    │   │   │   │   └── 📝 jwt-social-kakao.strategy.ts
    │   │   │   ├── 📝 auth.controller.ts
    │   │   │   ├── 📝 auth.module.ts
    │   │   │   ├── 📝 auth.resovler.ts
    │   │   │   └── 📝 auth.service.ts
    │   │   ├── 📂 dogs/
    │   │   │   ├── 📂 __test/
    │   │   │   │   └── 🛎️ dogs.resolver.spec.ts
    │   │   │   ├── 📂 dto/
    │   │   │   │   ├── 📝 create-dog.input
    │   │   │   │   └── 📝 update-dog.input
    │   │   │   ├── 📂 entities/
    │   │   │   │   └── 📝 dog.entity.ts
    │   │   │   ├── 📂 enum/
    │   │   │   │   └── 📝 dog-type.enum.ts
    │   │   │   ├── 📂 interfaces/
    │   │   │   │   └── 📝 dogs-service.interface.ts
    │   │   │   ├── 📝 dogs.module.ts
    │   │   │   ├── 📝 dogs.resolver.ts
    │   │   │   └── 📝 dogs.service.ts
    │   │   ├── 📂 files/
    │   │   │   ├── 📂 interfaces/
    │   │   │   │   └── 📝 files-service.interface
    │   │   │   ├── 📝 files.module.ts
    │   │   │   ├── 📝 files.resolver.ts
    │   │   │   └── 📝 files.service.ts
    │   │   ├── 📂 reservations/
    │   │   │   ├── 📂 dto/
    │   │   │   │   └── 📝 create-reservation.input.ts
    │   │   │   ├── 📂 entities/
    │   │   │   │   └── 📝 reservation.entity.ts
    │   │   │   ├── 📂 interfaces
    │   │   │   ├── 📝 reservation.module.ts
    │   │   │   ├── 📝 reservation.resolver.ts
    │   │   │   └── 📝 reservation.service.ts
    │   │   ├── 📂 reviews/
    │   │   │   ├── 📂 dto/
    │   │   │   │   └── 📝 create-review.input.ts
    │   │   │   ├── 📂 entities/
    │   │   │   │   └── 📝 review.entity.ts
    │   │   │   ├── 📂 interfaces/
    │   │   │   │   └── 📝 reviews-service.interface.ts
    │   │   │   ├── 📝 reviews.module.ts
    │   │   │   ├── 📝 reviews.resolver.ts
    │   │   │   └── 📝 reviews.service.ts
    │   │   ├── 📂 shop-review/
    │   │   │   ├── 📂 dto/
    │   │   │   │   └── 📝 return-shop-review.output
    │   │   │   ├── 📝 shop-review.module.ts
    │   │   │   ├── 📝 shop-review.resolver.ts
    │   │   │   └── 📝 shop-review.service.ts
    │   │   ├── 📂 shopImages/
    │   │   │   ├── 📂 __test__/
    │   │   │   │   ├── 📝 shopImage.moking.dummy.ts
    │   │   │   │   ├── 🛎️ shopImage.resolver.spec.ts
    │   │   │   │   └── 🛎️ shopImage.service.spec.ts
    │   │   │   ├── 📂 dto/
    │   │   │   │   ├── 📝 save-shopImage.input.ts
    │   │   │   │   └── 📝 update-shopImage.input.ts
    │   │   │   ├── 📂 entities/
    │   │   │   │   └── 📝 shopImages.entity.ts
    │   │   │   ├── 📂 interfaces/
    │   │   │   │   └── 📝 shopImages-service.interface.ts
    │   │   │   ├── 📝 shopImage.module.ts
    │   │   │   ├── 📝 shopImage.resolver.ts
    │   │   │   └── 📝 shopImage.service.ts
    │   │   ├── 📂 shops/
    │   │   │   ├── 📂 __test__/
    │   │   │   │   └── 🛎️ shops.service.spec.ts
    │   │   │   ├── 📂 dto/
    │   │   │   │   ├── 📝 create-shop.input.ts
    │   │   │   │   ├── 📝 return-shop.output.ts
    │   │   │   │   └── 📝 update-shop.input.ts
    │   │   │   ├── 📂 entities/
    │   │   │   │   └── 📝 shop.entity.ts
    │   │   │   ├── 📂 interfaces/
    │   │   │   │   └── 📝 shops-service.interface.ts
    │   │   │   ├── 📝 shops.module.ts
    │   │   │   ├── 📝 shops.resolver.ts
    │   │   │   └── 📝 shops.service.ts
    │   │   └── 📂 users/
    │   │       ├── 📂 __test__/
    │   │       │   └── 🛎️ users.service.spec.ts
    │   │       ├── 📂 dto/
    │   │       │   ├── 📝 create-users.input.ts
    │   │       │   └── 📝 update-users.input.ts
    │   │       ├── 📂 entities/
    │   │       │   └── 📝 user.entity.ts
    │   │       ├── 📂 interface/
    │   │       │   └── 📝 users.interface.ts
    │   │       ├── 📝 user.module.ts
    │   │       ├── 📝 user.resolver.ts
    │   │       └── 📝 user.service.ts
    │   ├── 📂 commons/
    │   │   ├── 📂 filter/
    │   │   │   └── 📝 http-exception.filter.ts
    │   │   ├── 📂 interface/
    │   │   │   └── 📝 context.ts
    │   │   └── 📂 utils/
    │   │       ├── 📝 addresscode.ts
    │   │       └── 📝 utils.ts
    │   ├── 📂 test/
    │   │   ├── 🛎️ app.e2e-spec.ts
    │   │   └── 🧸 jest-e2e.json
    │   ├── 📝 app.controller.ts
    │   ├── 📝 app.module.ts
    │   └── 📝 main.ts
    ├── 🐳 .dockerignore
    ├── 📝 .env.docker
    ├── 📝 .env.prod
    ├── 📝 .eslintrc.js
    ├── 📝 .gitignore
    ├── 📝 .prettierrc
    ├── 🐳 docker-compose.prod.yaml
    ├── 🐳 docker-compose.yaml
    ├── 🐳 Dockerfile
    ├── 🐳 Dockerfile.elasticsearch
    ├── 🐳 Dockerfile.logstash
    ├── 🐳 Dockerfile.prod
    ├── 🧸 nest-cli.json
    ├── 🧸 package.json
    ├── 🧸 project-groomeong-34231f48bd14.json
    ├── 📝 README.md
    ├── 🧸 settings.json
    ├── 🧸 tsconfig.build.json
    ├── 🧸 tsconfig.json
    ├── 📝 yarn-error.log
    └── 📝 yarn.lock
```

<br><br>

# .env

```
DATABASE_TYPE
DATABASE_HOST
DATABASE_PORT
DATABASE_USERNAME
DATABASE_PASSWORD
DATABASE_DATABASE
JWT_ACCESS_KEY
JWT_REFRESH_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
KAKAO_CLIENT_ID
KAKAO_CLIENT_SECRET
EMAIL_USER
EMAIL_PASS
EMAIL_HOST
EMAIL_FROM_USER_NAME
GCP_BUCKET_NAME
GCP_PROJECT_ID
GCP_KEY_FILENAME
GOOGLE_MAP_API_KEY
REDIS_URL
OPENSEARCH_ID
OPENSEARCH_PWD

```
