# AI 활용 기록 및 프롬프트 보고서

작성 시각: 2026-06-04 01:41:59 KST

## 목적

이 문서는 `swebook` 백엔드 프로젝트를 구현하는 과정에서 AI에게 전달한 프롬프트, AI가 수행한 작업, 주요 출력 결과, 그리고 검증에 사용한 명령을 기록하기 위해 작성되었다.

최종 보고서에서 "AI를 어떻게 활용했는가"를 설명할 수 있도록, 단순 질의부터 Docker, MySQL, 시딩, 도메인 구조 생성, API 테스트, 커밋 분리까지의 흐름을 정리했다.

## 활용 요약

AI는 다음 작업에 활용되었다.

- Gradle Java toolchain 오류 원인 분석 및 해결
- MySQL용 `docker-compose.yml` 작성
- Spring Boot와 MySQL datasource 연결
- README 작성
- DB 시딩 개념 설명
- DB migration 관련 이슈 라벨 추천
- DDL 기반 schema SQL 작성
- API 테스트용 seed data 작성
- Docker MySQL init script 방식으로 schema/data 초기화 구조 전환
- 한글 인코딩 깨짐 문제 분석 및 `SET NAMES utf8mb4` 적용
- API 설계 CSV를 읽고 도메인별 MVC 구조 구현
- 각 도메인별 기본 조회 API 구현
- `curl` 기반 API 동작 검증
- 도메인별 git commit 분리

## 가장 중요하고 유효했던 프롬프트

### 1. Docker 기반 DB 초기화 방식 전환

프롬프트:

```text
volumes:
  - ./db/init:/docker-entrypoint-initdb.d -> 도커를 이용해 docker compose up 하여 컨테이너를 초기에 처음 띄우게 되었을때 초기에, src/main/resources/schema.sql 파일을 이용해 테이블을 정의하고, src/main/resources/data.sql 파일로 데이터를 시딩하는 것을 구현해줘 현재같은 방식이 아닌 도커를 이용한 방식으로
```

중요했던 이유:

이 프롬프트는 Spring Boot 애플리케이션이 DB 초기화를 담당하던 구조를 Docker MySQL 공식 이미지의 init mechanism으로 전환하게 했다. 로컬 개발 환경에서 DB 컨테이너를 처음 띄우면 자동으로 테이블 생성과 시딩이 수행되므로 팀원이 동일한 초기 DB 상태를 쉽게 재현할 수 있다.

주요 출력 및 결과:

```yaml
services:
  mysql:
    image: mysql:8.4
    container_name: swebook-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: swebook
      MYSQL_USER: swebook_user
      MYSQL_PASSWORD: swebook_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./db/init:/docker-entrypoint-initdb.d:ro
```

검증 결과:

```text
users                 10
categories            132
books                 10
trade_posts           10
book_images           20
trade_available_time  20
trade_requests        10

MAJOR   12
COURSE  120
```

### 2. API 설계 CSV 기반 도메인 구조 생성

프롬프트:

```text
"API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv" 이 csv파일을 읽고 api설계를 위한 도메인 구조를 만들어줘 도메인에는 books , categories , trade-posts, me , trade-request 가 있을 것이며, 각 도미엔 별로 레포지토리 , 서비스, 컨트롤러의 MVC구조를 가지고있도록 구현해줘 그리고 각 도메인을 대표하는 엔티티도 정의해주고, 그 엔티티 조회하는 기본 api를 각 도메인별로 하나씩 만들어줘 그리고 curl을 통한 api 테스트까지 진행해줘
```

중요했던 이유:

이 프롬프트는 프로젝트의 실제 백엔드 구조를 만드는 핵심 작업이었다. CSV API 설계서를 기준으로 도메인을 나누고, 각 도메인에 `entity`, `repository`, `service`, `controller`, `dto` 계층을 생성했다. 또한 단순 파일 생성에 그치지 않고 실제 Spring Boot 서버를 실행한 뒤 `curl`로 API 응답을 검증했다.

주요 출력 및 결과:

구현된 도메인:

```text
books
categories
tradeposts
me
traderequests
```

구현된 기본 조회 API:

```text
GET /api/books/search?keyword=Code
GET /api/categories/majors
GET /api/categories/{majorCode}/courses
GET /api/trade-posts
GET /api/trade-posts/{postId}
GET /api/me/{userId}
GET /api/me/trade-requests/{userId}
GET /api/me/sales/requests/{userId}
GET /api/trade-requests/{requestId}
```

검증 결과:

```text
/api/books/search?keyword=Code        -> 200
/api/categories/majors                -> 200
/api/categories/100000/courses        -> 200
/api/trade-posts/1                    -> 200
/api/me/1                             -> 200
/api/me/trade-requests/1              -> 200
/api/me/sales/requests/1              -> 200
/api/trade-requests/1                 -> 200
```

### 3. 한글 인코딩 문제 분석 및 해결

프롬프트:

```text
지금 특히 category 테이블에서 인코딩이 잘못되는것같네 ? ë”¥ëŸ¬ë‹ 이런형식인데 ?
```

중요했던 이유:

시딩 데이터의 한글이 깨지는 문제는 API 응답 품질과 DB 데이터 신뢰성에 직접적인 영향을 준다. AI는 파일 인코딩, MySQL 서버/DB/테이블/커넥션 문자셋, 실제 저장된 HEX 값을 확인해 문제 원인이 Docker init에서 SQL을 실행하는 MySQL client 문자셋에 있음을 확인했다.

주요 출력 및 결과:

문제 확인:

```text
101103  ë”¥ëŸ¬ë‹
```

수정:

```sql
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
```

수정 후 확인:

```text
100000  컴퓨터공학
101103  딥러닝
111110  휴머노이드로봇
```

`딥러닝` 저장 HEX:

```text
EB94A5EB9FACEB8B9D
```

### 4. 도메인별 커밋 분리

프롬프트:

```text
각 도메인별로 커밋을 묶어서 커밋메세지를 적은 후 커밋해줄래 ? 푸시는 하지말고. 대부분 새로운 기능들의 추가이므로 feat: user도메인 구조 확립 및 조회 api 생성 -> 이러한 커밋메시지 포맷으로 각 도메인별로 커밋해줘
```

중요했던 이유:

기능 단위로 커밋을 분리하면 리뷰와 추적이 쉬워진다. 특히 도메인별 구조 생성은 변경 파일이 많기 때문에, 하나의 큰 커밋보다 도메인별 커밋이 더 적절했다.

생성된 커밋:

```text
3552b16 feat: books 도메인 구조 확립 및 조회 api 생성
ac555ef feat: categories 도메인 구조 확립 및 조회 api 생성
ddedebd feat: me 도메인 구조 확립 및 사용자 조회 api 생성
3c31a72 feat: trade-posts 도메인 구조 확립 및 조회 api 생성
c18a765 feat: trade-requests 도메인 구조 확립 및 조회 api 생성
2cee1cf feat: me 도메인 구매 및 판매 요청 조회 api 생성
```

## 전체 프롬프트 기록

아래는 현재 세션에서 확인 가능한 사용자 프롬프트를 작업 흐름 순서대로 정리한 것이다.

### 1. 원인 및 해결책 재확인

```text
방금 뭐가 원인이었다고 ? 그리고 해결책은 뭐라고 ?
```

AI 응답 요약:

`fnm`이 shell 초기화 과정에서 `/Users/tony/.local/state/fnm_multishells`에 symlink를 만들려고 했지만 권한이 없어 실패한 것으로 설명했다. 애플리케이션 코드 문제가 아니라 로컬 shell 환경의 권한 문제라고 안내했다.

### 2. Gradle Java 17 toolchain 오류 해결

```text
Could not resolve all dependencies for configuration ':compileClasspath'.
Failed to calculate the value of task ':compileJava' property 'javaCompiler'.
Cannot find a Java installation on your machine (Mac OS X 26.4 aarch64) matching: {languageVersion=17, vendor=any vendor, implementation=vendor-specific, nativeImageCapable=false}. Toolchain download repositories have not been configured.
...
BUILD FAILED in 265ms 해당 의존성 에러 해결해줘
```

AI 응답 요약:

의존성 자체 문제가 아니라 Java 17 toolchain을 찾지 못한 문제라고 분석했다. `settings.gradle`에 Foojay resolver plugin을 추가했다.

주요 출력:

```gradle
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '1.0.0'
}
```

검증:

```text
./gradlew compileJava
BUILD SUCCESSFUL
```

### 3. MySQL Docker Compose 파일 생성

```text
이 프로젝트에 대한 docker-compose 파일을 만들어야해. mysql을 띄우기 위한 파일이며 , mysql db만 띄우면 돼. 그리고 User와 비밀번호도 명시해줘
```

AI 응답 요약:

MySQL 8.4 단일 서비스를 띄우는 `docker-compose.yml`을 작성했다.

주요 설정:

```text
Database: swebook
User: swebook_user
Password: swebook_password
Root password: root_password
Port: 3306
```

### 4. Spring Boot와 MySQL 연결

```text
본래의 스프링부트 프로젝트에 대하여 해당 mysql db와의 연결을 진행해줘 그리고 따로 .env 파일 없이 로컬에서만 돌릴거라 바로 properties에 박아놔도 될것같아
```

AI 응답 요약:

`application.properties`에 datasource 설정을 추가하고 H2 의존성을 제거했다.

주요 출력:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/swebook?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
spring.datasource.username=swebook_user
spring.datasource.password=swebook_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

검증:

```text
docker compose up -d mysql
./gradlew test
BUILD SUCCESSFUL
```

### 5. README 추가

```text
그리고 기술스택 나열과 프로젝트 시작 , 도커 사용 명령어, 그리고 빌드 방법 등 기본적인 내용들이 들어가있는 readme 파일도 추가해주 ㅓ
```

AI 응답 요약:

기술 스택, Docker 사용법, DB 접속 정보, 실행, 테스트, 빌드 방법을 포함한 `README.md`를 작성했다.

### 6. 시딩 개념 설명

```text
그리고 동료 개발자가 시딩을 고려해서 만들어달라는데 시딩이라는게 무슨의미지 ????
```

AI 응답 요약:

시딩은 개발/테스트용 초기 데이터를 DB에 미리 넣어두는 것이라고 설명했다.

### 7. DB migration 이슈 라벨 추천

```text
데이터베이스 마이그레이션 관련 파일들을 설정하려고하는데 , 레이블이 어떤게 좋을까 ?
```

```text
이슈 레이블로 좋은게 무엇일까 말이야
```

AI 응답 요약:

`db-migration` 레이블을 추천했다. 함께 쓰기 좋은 레이블로 `backend`, `infra`, `seed-data`를 제안했다.

### 8. MySQL + Spring Boot에서 DDL과 시딩 가능 여부 질문

```text
mysql + springboot 조합에서 DDl을 사용해 테이블 생성 및 시딩까지 가능하낙?
```

AI 응답 요약:

가능하다고 설명했다. `schema.sql`, `data.sql`, `CommandLineRunner`, Flyway/Liquibase, Docker init script 방식의 차이를 설명했다.

### 9. DDL 기반 schema/data SQL 생성

프롬프트 요약:

```text
전달한 MySQL DDL이 현재 프로젝트 DB에 대한 DDL이며, 스키마 파일과 이에 맞는 시딩 파일을 생성해줘.
시딩할 때에는 API 테스트에 충분할 수 있도록 각 테이블당 10개 이상은 추가해줘.
```

AI 응답 요약:

`schema.sql`, `data.sql`을 생성했고 각 테이블에 10건 이상 데이터가 들어가도록 구성했다.

검증:

```text
users                 10
categories            15
books                 10
trade_posts           10
book_images           20
trade_available_time  20
trade_requests        10
```

추가 분석:

MySQL 8.4에서 `categories.parent_code`가 `ON UPDATE CASCADE` FK와 CHECK 제약에 동시에 사용되면 오류가 발생해, 해당 CHECK 제약을 제거했다.

### 10. Category 시딩 데이터 교체

프롬프트 요약:

```text
category 시딩 관련된 부분은 INSERT INTO category (category_code, parent_code, type, name) VALUES
...
전공 12개와 각 전공별 과목 10개를 포함한 카테고리 데이터로 바꿔주라
```

AI 응답 요약:

기존 영문 카테고리 seed를 전공/과목 코드 체계로 교체했다.

검증:

```text
MAJOR   12
COURSE  120
invalid_post_category_count  0
```

### 11. Docker init 방식으로 DB 초기화 전환

```text
volumes:
  - ./db/init:/docker-entrypoint-initdb.d -> 도커를 이용해 docker compose up 하여 컨테이너를 초기에 처음 띄우게 되었을때 초기에, src/main/resources/schema.sql 파일을 이용해 테이블을 정의하고, src/main/resources/data.sql 파일로 데이터를 시딩하는 것을 구현해줘 현재같은 방식이 아닌 도커를 이용한 방식으로
```

AI 응답 요약:

Spring Boot SQL init을 끄고 Docker MySQL init 방식으로 전환했다.

주요 설정:

```properties
spring.sql.init.mode=never
spring.jpa.hibernate.ddl-auto=none
```

```yaml
volumes:
  - ./db/init:/docker-entrypoint-initdb.d:ro
```

### 12. Category 한글 인코딩 문제 해결

```text
지금 특히 category 테이블에서 인코딩이 잘못되는것같네 ? ë”¥ëŸ¬ë‹ 이런형식인데 ?
```

AI 응답 요약:

실제 DB 저장값이 깨진 상태임을 확인했고, `data.sql` 상단에 `SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;`를 추가했다. 이후 볼륨을 삭제하고 재초기화했다.

검증:

```text
101103  딥러닝
```

### 13. resources SQL 삭제

```text
그리고 이제 src/main/resources/data.sql 파일과 src/main/resources/schema.sql 파일은 의미가 없는거니까 지워도 되지 ? db 경로에 다 들어있으니,
```

AI 응답 요약:

Spring Boot SQL init을 사용하지 않으므로 `src/main/resources/schema.sql`, `src/main/resources/data.sql`을 삭제했다. SQL 원본은 `db/init`에만 남겼다.

### 14. CSV API 설계서 기반 도메인 구조 및 조회 API 생성

```text
"API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv" 이 csv파일을 읽고 api설계를 위한 도메인 구조를 만들어줘 도메인에는 books , categories , trade-posts, me , trade-request 가 있을 것이며, 각 도미엔 별로 레포지토리 , 서비스, 컨트롤러의 MVC구조를 가지고있도록 구현해줘 그리고 각 도메인을 대표하는 엔티티도 정의해주고, 그 엔티티 조회하는 기본 api를 각 도메인별로 하나씩 만들어줘 그리고 curl을 통한 api 테스트까지 진행해줘
```

AI 응답 요약:

CSV의 API 설계 내용을 읽고 도메인별 MVC 구조, 엔티티, DTO, Repository, Service, Controller를 구현했다. 실제 `curl` 테스트를 수행했다.

### 15. 도메인별 커밋 분리

```text
각 도메인별로 커밋을 묶어서 커밋메세지를 적은 후 커밋해줄래 ? 푸시는 하지말고. 대부분 새로운 기능들의 추가이므로 feat: user도메인 구조 확립 및 조회 api 생성 -> 이러한 커밋메시지 포맷으로 각 도메인별로 커밋해줘
```

AI 응답 요약:

도메인별로 커밋을 나누어 생성했고 푸시는 하지 않았다.

## 실행 명령 기록

아래는 작업 중 사용된 주요 명령이다. shell 초기화 과정에서 반복 출력된 `fnm_multishells` 권한 경고는 명령 자체의 결과와 무관하므로 설명에서 제외했다.

### 상태 및 파일 확인

```bash
git status --short
git log --oneline -5
pwd
rg --files
sed -n '1,220p' build.gradle
sed -n '1,220p' settings.gradle
sed -n '1,160p' gradle/wrapper/gradle-wrapper.properties
sed -n '1,160p' src/main/resources/application.properties
rg -n "mysql|datasource|jdbc|database|spring.datasource" .
rg --files -g '*compose*' -g 'Dockerfile'
find src/main/java -type f -maxdepth 8 -print
find src/main/resources -maxdepth 2 -type f
```

### Java/Gradle 확인 및 빌드

```bash
/usr/libexec/java_home -V
./gradlew --version
env GRADLE_USER_HOME=.gradle-home ./gradlew compileJava
./gradlew compileJava
./gradlew test
./gradlew build
./gradlew bootRun
```

주요 결과:

```text
BUILD SUCCESSFUL
```

### Docker Compose 및 MySQL 확인

```bash
docker compose config
docker compose up -d mysql
docker compose ps
docker compose down -v
docker inspect --format '{{.State.Health.Status}}' swebook-mysql
docker logs swebook-mysql
```

주요 결과:

```text
swebook-mysql Up ... healthy
```

### MySQL 데이터 검증

```bash
docker exec swebook-mysql mysql -uswebook_user -pswebook_password swebook -e "SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users UNION ALL SELECT 'categories', COUNT(*) FROM categories UNION ALL SELECT 'books', COUNT(*) FROM books UNION ALL SELECT 'trade_posts', COUNT(*) FROM trade_posts UNION ALL SELECT 'book_images', COUNT(*) FROM book_images UNION ALL SELECT 'trade_available_time', COUNT(*) FROM trade_available_time UNION ALL SELECT 'trade_requests', COUNT(*) FROM trade_requests;"
```

```bash
docker exec swebook-mysql mysql --default-character-set=utf8mb4 -uswebook_user -pswebook_password swebook -e "SELECT category_code, name, HEX(name) AS name_hex FROM categories WHERE category_code IN ('100000','101103','111110') ORDER BY category_code; SELECT type, COUNT(*) AS row_count FROM categories GROUP BY type;"
```

주요 결과:

```text
users                 10
categories            132
books                 10
trade_posts           10
book_images           20
trade_available_time  20
trade_requests        10
```

```text
100000  컴퓨터공학
101103  딥러닝
111110  휴머노이드로봇
```

### API 설계 CSV 확인

```bash
rg --files -g '*.csv'
find . -maxdepth 3 -type f -name '*.csv' -print
wc -l "API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv"
sed -n '1,80p' "API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv"
file -I "API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv"
```

CSV에서 확인한 주요 API:

```text
/api/books
/api/categories/majors
/api/categories/{majorCode}/courses
/api/books/search?keyword={keyword}
/api/trade-posts/{postId}
/api/trade-posts
/api/trade-posts/{postId}/requests
/api/trade-posts/{postId}/available-times
/api/me/sales/requests/{userId}
/api/me/trade-requests/{userId}
/api/trade-requests/{requestId}/accept
/api/trade-requests/{requestId}/reject
/api/trade-posts/{postId}/complete
```

### API curl 테스트

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/books/search?keyword=Code'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/categories/majors'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/categories/100000/courses'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/trade-posts/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/trade-requests/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/sales/requests/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/trade-requests/1'
```

주요 결과:

```text
HTTP_STATUS:200
```

대표 응답:

```json
{
  "postId": 1,
  "sellerId": 1,
  "sellerNickname": "alice",
  "bookId": 1,
  "bookTitle": "Introduction to Algorithms",
  "categoryCode": "100101",
  "categoryName": "자료구조",
  "price": 42000,
  "status": "AVAILABLE"
}
```

### 포트 및 프로세스 확인

```bash
lsof -i :8080 -n -P
kill 30132
```

설명:

API 테스트를 위해 `./gradlew bootRun`으로 서버를 띄웠고, 테스트 후 해당 Java 프로세스를 종료했다.

### Git 커밋 명령

```bash
git add src/main/java/com/example/swebook/books
git commit -m "feat: books 도메인 구조 확립 및 조회 api 생성"

git add src/main/java/com/example/swebook/categories
git commit -m "feat: categories 도메인 구조 확립 및 조회 api 생성"

git add src/main/java/com/example/swebook/me/controller/MeController.java src/main/java/com/example/swebook/me/dto/UserResponse.java src/main/java/com/example/swebook/me/entity/User.java src/main/java/com/example/swebook/me/repository/UserRepository.java src/main/java/com/example/swebook/me/service/MeService.java
git commit -m "feat: me 도메인 구조 확립 및 사용자 조회 api 생성"

git add src/main/java/com/example/swebook/tradeposts
git commit -m "feat: trade-posts 도메인 구조 확립 및 조회 api 생성"

git add src/main/java/com/example/swebook/traderequests
git commit -m "feat: trade-requests 도메인 구조 확립 및 조회 api 생성"

git add src/main/java/com/example/swebook/me/controller/MeController.java src/main/java/com/example/swebook/me/service/MeService.java src/main/java/com/example/swebook/me/dto/MeTradeRequestResponse.java src/main/java/com/example/swebook/me/repository/MeTradeRequestRepository.java
git commit -m "feat: me 도메인 구매 및 판매 요청 조회 api 생성"
```

생성된 커밋:

```text
3552b16 feat: books 도메인 구조 확립 및 조회 api 생성
ac555ef feat: categories 도메인 구조 확립 및 조회 api 생성
ddedebd feat: me 도메인 구조 확립 및 사용자 조회 api 생성
3c31a72 feat: trade-posts 도메인 구조 확립 및 조회 api 생성
c18a765 feat: trade-requests 도메인 구조 확립 및 조회 api 생성
2cee1cf feat: me 도메인 구매 및 판매 요청 조회 api 생성
```

## AI 활용 방식에 대한 서술

이번 프로젝트에서 AI는 단순 코드 생성 도구가 아니라, 개발 흐름을 함께 점검하는 페어 프로그래밍 도구로 활용되었다.

첫째, 오류 분석에 활용했다. Gradle Java toolchain 오류처럼 원인이 명확하지 않은 문제에 대해 AI가 로컬 JDK 상태, Gradle 설정, 빌드 로그를 확인하고 원인을 분리했다. 이를 통해 의존성 문제가 아니라 Java 17 toolchain resolver 설정 문제임을 확인했다.

둘째, 인프라 구성 자동화에 활용했다. MySQL Docker Compose 설정, DB 계정 정보, healthcheck, Docker init script 구조를 작성하고 실제 컨테이너를 올려 검증했다. 특히 Spring Boot SQL init 방식에서 Docker MySQL init 방식으로 전환하면서 로컬 개발 환경 재현성을 높였다.

셋째, 데이터베이스 설계와 시딩에 활용했다. 전달한 DDL을 기반으로 schema SQL과 seed SQL을 구성했고, API 테스트에 충분한 데이터를 생성했다. 이후 한글 인코딩 문제가 발생했을 때도 파일 인코딩, MySQL 변수, 저장 HEX 값을 비교해 원인을 찾고 `SET NAMES utf8mb4`로 해결했다.

넷째, API 설계서 기반 구현에 활용했다. CSV 파일을 읽어 API 경로와 도메인을 파악하고, `books`, `categories`, `trade-posts`, `me`, `trade-request` 도메인별 MVC 구조를 만들었다. 각 도메인에 대표 엔티티, Repository, Service, Controller, DTO를 구성했으며, 실제 `curl` 요청으로 동작을 검증했다.

다섯째, 협업 가능한 git history 정리에 활용했다. 구현이 끝난 뒤 도메인별 커밋으로 나누어 변경 이력을 구조화했다. 이를 통해 코드 리뷰와 추후 변경 추적이 쉬운 형태로 정리할 수 있었다.

## 참고 사항

- `fnm_multishells` 관련 권한 경고는 shell 초기화 과정에서 발생한 로컬 환경 문제이며, 애플리케이션 빌드나 API 동작과 직접 관련이 없었다.
- API 설계 CSV 파일과 `.DS_Store` 파일은 도메인 커밋에 포함하지 않았다.
- Docker MySQL init script는 데이터 볼륨이 비어 있는 최초 실행 시점에만 동작한다. 시딩을 다시 적용하려면 `docker compose down -v` 후 `docker compose up -d`를 실행해야 한다.
