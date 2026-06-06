# 2026학년도 1학기 Software Engineering

## SWEBook

SWEBook은 대학생들이 사용하지 않는 전공 서적을 같은 학교 또는 가까운 지역 학생들과 직접 거래할 수 있도록 만든 위치 기반 중고 전공서 거래 서비스입니다.

현재 구현 범위는 과제용 데모 애플리케이션입니다. 실제 회원가입, JWT 인증, 결제, 채팅, 지도 SDK는 구현하지 않고, Git으로 공유되는 SQLite 데모 DB와 시드 사용자 로그인을 사용합니다.

## 주요 기능

- 학교/동네 기준 전공서 매물 목록 조회
- 과목 칩과 검색어 기반 매물 탐색
- 판매글 상세 조회 및 거래 가능 시간 확인
- 과제용 시드 사용자 로그인
- 판매글 등록 및 이미지 업로드
- 구매 요청 생성
- 내가 보낸 구매 요청 내역 조회
- 내 판매 목록 조회
- 내 판매글에 들어온 구매 요청 조회
- 구매 요청 수락/거절
- 404, 409 오류 상세 사유 표시
- SQLite 데모 DB 초기화

## 프로젝트 구조

```text
.
├── Backend/swebook
│   ├── data/swebook.sqlite
│   ├── db/sqlite
│   ├── scripts/reset-sqlite-db.sh
│   └── src/main/java/com/example/swebook
└── frontend
    ├── apps/mobile
    └── packages
```

## 사전 준비

- Java 17
- pnpm
- sqlite3 CLI

백엔드는 Gradle Wrapper를 사용하므로 별도 Gradle 설치는 필요하지 않습니다.

## DB 설명

이 프로젝트는 과제 공유 편의를 위해 MySQL 대신 SQLite를 사용합니다. 기본 DB 파일은 Git에 포함됩니다.

```text
Backend/swebook/data/swebook.sqlite
```

백엔드는 기본적으로 위 파일을 사용합니다.

```properties
spring.datasource.url=jdbc:sqlite:${SWEBOOK_DB_PATH:./data/swebook.sqlite}
```

데모 데이터는 SQL 파일에서 관리합니다.

```text
Backend/swebook/db/sqlite/01-schema.sql
Backend/swebook/db/sqlite/02-seed.sql
```

DB를 언제든 초기 상태로 되돌리려면 다음 명령을 실행합니다. 실행 중인 백엔드가 있다면 먼저 종료한 뒤 초기화하는 것이 안전합니다.

```bash
cd Backend/swebook
./scripts/reset-sqlite-db.sh
```

다른 위치의 임시 DB를 사용하려면 `SWEBOOK_DB_PATH`를 지정합니다.

```bash
cd Backend/swebook
SWEBOOK_DB_PATH=/tmp/swebook-demo.sqlite ./scripts/reset-sqlite-db.sh
SWEBOOK_DB_PATH=/tmp/swebook-demo.sqlite ./gradlew bootRun
```

DB 상태 확인 예시:

```bash
cd Backend/swebook
sqlite3 data/swebook.sqlite "SELECT status, COUNT(*) FROM trade_posts WHERE deleted_at IS NULL GROUP BY status;"
sqlite3 data/swebook.sqlite "SELECT request_id, user_id, post_id, status FROM trade_requests ORDER BY request_id;"
```

## 백엔드 실행

```bash
cd Backend/swebook
./gradlew bootRun
```

기본 주소:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## 프론트엔드 실행

```bash
cd frontend
pnpm install
pnpm --filter @swebook/mobile dev
```

기본 주소:

```text
http://localhost:5173
```

프론트엔드는 기본 API 주소로 `http://localhost:8080`을 사용합니다. 별도 주소를 쓰려면 `frontend/apps/mobile/.env`에 값을 지정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## 데모 활용 방법

1. 백엔드를 실행합니다.
2. 프론트엔드를 실행합니다.
3. 브라우저에서 `http://localhost:5173`에 접속합니다.
4. 우측 상단 `로그인`을 눌러 시드 사용자를 선택합니다.
5. 홈에서 동네와 과목을 바꿔 매물을 확인합니다.
6. 판매글 상세에서 거래 가능 시간을 선택하고 구매 요청을 보냅니다.
7. 하단 `요청내역`에서 내가 보낸 구매 요청을 확인합니다.
8. `판매 목록`에서 내 판매글을 확인합니다.
9. `받은 요청`에서 내 판매글에 들어온 구매 요청을 수락하거나 거절합니다.

시드 사용자 예시:

```text
1 alice
2 brian
3 chloe
4 david
5 emma
```

주요 데모 상태:

- alice는 구매 요청 내역과 판매글을 모두 가지고 있습니다.
- alice의 판매글에는 emma가 보낸 대기중 요청이 있습니다.
- 일부 판매글은 `RESERVED`, `SOLD` 상태 확인용으로 준비되어 있습니다.
- 중복 구매 요청, 없는 판매글 접근 등은 상세 오류 메시지를 표시합니다.

## 테스트와 빌드

백엔드:

```bash
cd Backend/swebook
./gradlew test
./gradlew build
```

프론트엔드:

```bash
cd frontend
pnpm --filter @swebook/mobile check
pnpm --filter @swebook/mobile build
```

## 주요 문서

- [백엔드 README](Backend/swebook/README.md)
- [작업 보고서](docs/swebook-work-report.md)
