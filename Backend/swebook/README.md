# swebook

Spring Boot 기반 SWEBook 백엔드 프로젝트입니다.

## 기술 스택

- Java 17
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- Spring Validation
- SQLite
- Gradle 9.5.1
- Lombok

## DB 구성

과제 공유용 기본 DB는 Git에 포함된 SQLite 파일을 사용합니다.

```text
data/swebook.sqlite
```

Spring Boot datasource는 기본적으로 이 파일을 자동 탐색해 사용합니다. `Backend/swebook`에서 실행해도, 레포 루트에서 실행해도 `Backend/swebook/data/swebook.sqlite`를 찾도록 구성되어 있습니다.

다른 DB 파일을 임시로 쓰고 싶으면 `SWEBOOK_DB_PATH`를 지정하면 됩니다.

```bash
SWEBOOK_DB_PATH=/tmp/swebook-demo.sqlite ./gradlew bootRun
```

## 데모 데이터

초기 데이터는 아래 SQL에서 관리합니다.

- `db/sqlite/01-schema.sql`: SQLite 테이블, 인덱스, updated_at trigger
- `db/sqlite/02-seed.sql`: 과제 데모용 사용자, 카테고리, 도서, 판매글, 이미지, 거래 가능 시간, 구매 요청

seed는 프론트 과제용 로그인 후보와 맞춰져 있습니다.

```text
1 alice
2 brian
3 chloe
4 david
5 emma
```

데모 데이터에는 다음 흐름을 확인할 수 있는 상태가 포함되어 있습니다.

- 홈 판매글 목록 및 근처 판매글 검색
- 과목별 필터
- 판매글 상세 이미지와 거래 가능 시간
- 판매글 등록 후 DB 저장
- 이미지 업로드 후 `/uploads/...` 경로 저장
- 구매 요청 생성
- 자기 판매글 구매 요청 차단
- 같은 판매글 중복 구매 요청 차단
- 요청 수락/거절과 RESERVED 상태
- SOLD 상태
- soft delete 필터

## DB 초기화

데모 중 데이터가 변경되면 언제든 아래 명령으로 Git에 포함된 기본 상태로 되돌릴 수 있습니다.

```bash
./scripts/reset-sqlite-db.sh
```

초기화 스크립트는 `data/swebook.sqlite`를 삭제한 뒤 `01-schema.sql`, `02-seed.sql` 순서로 다시 생성합니다.

다른 위치의 DB 파일을 초기화하려면 `SWEBOOK_DB_PATH`를 지정합니다.

```bash
SWEBOOK_DB_PATH=/tmp/swebook-demo.sqlite ./scripts/reset-sqlite-db.sh
```

데이터 확인 예시:

```bash
sqlite3 data/swebook.sqlite "SELECT status, COUNT(*) FROM trade_posts WHERE deleted_at IS NULL GROUP BY status;"
```

## 프로젝트 실행

별도 DB 서버나 Docker 없이 바로 실행합니다.

```bash
./gradlew bootRun
```

기본 실행 주소:

```text
http://localhost:8080
```

## API 문서

Spring Boot 애플리케이션 실행 후 Swagger UI에서 API 문서를 확인할 수 있습니다.

```text
http://localhost:8080/swagger-ui.html
```

OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs
```

도메인별 OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs/books
http://localhost:8080/v3/api-docs/categories
http://localhost:8080/v3/api-docs/trade-posts
http://localhost:8080/v3/api-docs/me
http://localhost:8080/v3/api-docs/trade-requests
```

## 테스트

```bash
./gradlew test
```

## 빌드

```bash
./gradlew build
```

빌드 결과물은 `build/libs` 아래에 생성됩니다.

## 주요 파일

- `build.gradle`: Gradle 빌드 및 SQLite 의존성 설정
- `db/sqlite/01-schema.sql`: SQLite 테이블 생성 스크립트
- `db/sqlite/02-seed.sql`: 과제 데모 데이터
- `data/swebook.sqlite`: Git으로 공유되는 기본 SQLite DB 파일
- `scripts/reset-sqlite-db.sh`: 기본 DB 초기화 스크립트
- `src/main/resources/application.properties`: Spring Boot 및 SQLite 연결 설정
