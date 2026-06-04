# 사용자 프롬프트 원문 기록

이 문서는 최종 보고서 제출을 위해, 현재 대화에서 사용자가 CLI에 입력한 프롬프트의 정확한 워딩을 기록한 것이다.

SQL 원문, 긴 DDL, 긴 INSERT 데이터 본문은 제외했다. 대신 해당 시점에 사용자가 어떤 작업을 요구했는지 알 수 있도록 실제 요청 문장은 그대로 기록했다.

## 프롬프트 원문

### 1

```text
방금 뭐가 원인이었다고 ? 그리고 해결책은 뭐라고 ?
```

### 2

```text
Could not resolve all dependencies for configuration ':compileClasspath'.
Failed to calculate the value of task ':compileJava' property 'javaCompiler'.
Cannot find a Java installation on your machine (Mac OS X 26.4 aarch64) matching: {languageVersion=17, vendor=any vendor, implementation=vendor-specific, nativeImageCapable=false}. Toolchain download repositories have not been configured.
> Could not resolve all dependencies for configuration ':compileClasspath'.
  Failed to calculate the value of task ':compileJava' property 'javaCompiler'.
  Cannot find a Java installation on your machine (Mac OS X 26.4 aarch64) matching: {languageVersion=17, vendor=any vendor, implementation=vendor-specific, nativeImageCapable=false}. Toolchain download repositories have not been configured.

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights from a Build Scan (powered by Develocity).
> Get more help at https://help.gradle.org.

BUILD FAILED in 265ms 해당 의존성 에러 해결해줘
```

### 3

```text
이 프로젝트에 대한 docker-compose 파일을 만들어야해. mysql을 띄우기 위한 파일이며 , mysql db만 띄우면 돼. 그리고 User와 비밀번호도 명시해줘
```

### 4

```text
본래의 스프링부트 프로젝트에 대하여 해당 mysql db와의 연결을 진행해줘 그리고 따로 .env 파일 없이 로컬에서만 돌릴거라 바로 properties에 박아놔도 될것같아
```

### 5

```text
그리고 기술스택 나열과 프로젝트 시작 , 도커 사용 명령어, 그리고 빌드 방법 등 기본적인 내용들이 들어가있는 readme 파일도 추가해주 ㅓ
```

### 6

```text
그리고 동료 개발자가 시딩을 고려해서 만들어달라는데 시딩이라는게 무슨의미지 ????
```

### 7

```text
데이터베이스 마이그레이션 관련 파일들을 설정하려고하는데 , 레이블이 어떤게 좋을까 ?
```

### 8

```text
이슈 레이블로 좋은게 무엇일까 말이야
```

### 9

```text
mysql + springboot 조합에서 DDl을 사용해 테이블 생성 및 시딩까지 가능하낙?
```

### 10

```text
이것이 현재 프로젝트 db에 대한 ddl이며, 스키마 파일과 이에 맞는 시딩 파일을 생성해줘 시딩할때에는 api 테스트에 충분할 수 있도록 각 테이블당 10개 이상은 추가해줘
```

메모:

```text
이 프롬프트 앞에는 사용자가 긴 MySQL DDL 원문을 붙여넣었다. SQL 본문은 이 문서에서 제외했다.
```

### 11

```text
category 시딩 관련된 부분은 INSERT INTO category (category_code, parent_code, type, name) VALUES ... 이렇게 바꿔주라
```

메모:

```text
이 프롬프트에는 전공 12개와 각 전공별 과목 10개에 대한 긴 INSERT 데이터가 포함되어 있었다. SQL 본문은 이 문서에서 제외했다.
```

### 12

```text
volumes:
  - ./db/init:/docker-entrypoint-initdb.d -> 도커를 이용해 docker compose up 하여 컨테이너를 초기에 처음
```

메모:

```text
이 프롬프트는 중간에 사용자가 직접 중단했다.
```

### 13

```text
volumes:
  - ./db/init:/docker-entrypoint-initdb.d -> 도커를 이용해 docker compose up 하여 컨테이너를 초기에 처음 띄우게 되었을때 초기에, src/main/resources/schema.sql 파일을 이용해 테이블을 정의하고, src/main/resources/data.sql 파일로 데이터를 시딩하는 것을 구현해줘 현재같은 방식이 아닌 도커를 이용한 방식으로
```

### 14

```text
지금 특히 category 테이블에서 인코딩이 잘못되는것같네 ? ë”¥ëŸ¬ë‹ 이런형식인데 ?
```

### 15

```text
그리고 이제 src/main/resources/data.sql 파일과 src/main/resources/schema.sql 파일은 의미가 없는거니까 지워도 되지 ? db 경로에 다 들어있으니,
```

### 16

```text
"API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv" 이 csv파일을 읽고 api설계를 위한 도메인 구조를 만들어줘 도메인에는 books , categories , trade-posts, me , trade-request 가 있을 것이며, 각 도미엔 별로 레포지토리 , 서비스, 컨트롤러의 MVC구조를 가지고있도록 구현해줘 그리고 각 도메인을 대표하는 엔티티도 정의해주고, 그 엔티티 조회하는 기본 api를 각 도메인별로 하나씩 만들어줘 그리고 curl을 통한 api 테스트까지 진행해줘
```

### 17

```text
각 도메인별로 커밋을 묶어서 커밋메세지를 적은 후 커밋해줄래 ? 푸시는 하지말고. 대부분 새로운 기능들의 추가이므로 feat: user도메인 구조 확립 및 조회 api 생성 -> 이러한 커밋메시지 포맷으로 각 도메인별로 커밋해줘
```

### 18

```text
그리고 지금 내가 cli로 내린 프롬프트를 하나의 md파일로 모두 정리해줘 추가적으로 최종 보고서에 어떻게 ai를 활용하였는지 적어야해서 , 어떤 프롬프트가 가장 유효했고 중요했는지 서술해주고 해당 프롬프트에 대한 출력문도 적어줘. 혹시 모르니 모든 명령, 프롬프트들을 기록해달라는 말이야
```

### 19

```text
아니 정확히 내가 어떤 명령어를 내렸는지 정확한 워딩이 필요하다니까 ?
```

### 20

```text
아 아니야 sql문까지는 필요없어
```

## 가장 유효했고 중요했던 프롬프트

### 1. Docker init 방식으로 DB 초기화 전환

```text
volumes:
  - ./db/init:/docker-entrypoint-initdb.d -> 도커를 이용해 docker compose up 하여 컨테이너를 초기에 처음 띄우게 되었을때 초기에, src/main/resources/schema.sql 파일을 이용해 테이블을 정의하고, src/main/resources/data.sql 파일로 데이터를 시딩하는 것을 구현해줘 현재같은 방식이 아닌 도커를 이용한 방식으로
```

이 프롬프트가 중요했던 이유:

Spring Boot가 실행될 때 DB를 초기화하는 방식에서 벗어나, MySQL Docker 컨테이너가 최초 실행될 때 스키마와 시딩 데이터를 자동 적용하는 구조로 바꾸는 핵심 요청이었다. 이로 인해 팀원이 `docker compose up -d`만 실행해도 동일한 초기 DB 상태를 만들 수 있게 되었다.

주요 출력:

```text
docker-compose.yml에 ./db/init:/docker-entrypoint-initdb.d:ro 볼륨이 추가되었다.
Spring Boot의 SQL init은 spring.sql.init.mode=never로 비활성화되었다.
```

### 2. API 설계 CSV 기반 도메인 구조 구현

```text
"API 설계서 36ea9352190180e1b3cef2e4501dbcff.csv" 이 csv파일을 읽고 api설계를 위한 도메인 구조를 만들어줘 도메인에는 books , categories , trade-posts, me , trade-request 가 있을 것이며, 각 도미엔 별로 레포지토리 , 서비스, 컨트롤러의 MVC구조를 가지고있도록 구현해줘 그리고 각 도메인을 대표하는 엔티티도 정의해주고, 그 엔티티 조회하는 기본 api를 각 도메인별로 하나씩 만들어줘 그리고 curl을 통한 api 테스트까지 진행해줘
```

이 프롬프트가 중요했던 이유:

프로젝트의 실제 백엔드 도메인 구조를 생성한 핵심 요청이었다. CSV 설계서를 기준으로 `books`, `categories`, `trade-posts`, `me`, `trade-request` 도메인을 나누고, 각 도메인에 MVC 계층과 대표 엔티티, 조회 API를 구현했다.

주요 출력:

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

검증 출력:

```text
모든 대표 조회 API curl 테스트에서 HTTP_STATUS:200 확인
```

### 3. Category 한글 인코딩 문제 제기

```text
지금 특히 category 테이블에서 인코딩이 잘못되는것같네 ? ë”¥ëŸ¬ë‹ 이런형식인데 ?
```

이 프롬프트가 중요했던 이유:

DB에 저장된 category 한글 데이터가 실제로 깨져 있음을 확인하게 만든 요청이었다. 이후 seed SQL 실행 시점의 문자셋 문제를 확인하고, UTF-8 설정을 추가해 한글 데이터가 정상 저장되도록 수정했다.

주요 출력:

```text
101103  딥러닝
```

## 함께 기록할 주요 명령

사용자 프롬프트에 따라 AI가 실행한 주요 명령은 다음과 같다.

```bash
./gradlew compileJava
./gradlew test
./gradlew build
docker compose config
docker compose up -d mysql
docker compose down -v
docker inspect --format '{{.State.Health.Status}}' swebook-mysql
docker exec swebook-mysql mysql --default-character-set=utf8mb4 -uswebook_user -pswebook_password swebook -e "..."
./gradlew bootRun
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/books/search?keyword=Code'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/categories/majors'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/categories/100000/courses'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/trade-posts/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/trade-requests/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/me/sales/requests/1'
curl -s -w '\nHTTP_STATUS:%{http_code}\n' 'http://localhost:8080/api/trade-requests/1'
```

## 생성된 커밋

```text
3552b16 feat: books 도메인 구조 확립 및 조회 api 생성
ac555ef feat: categories 도메인 구조 확립 및 조회 api 생성
ddedebd feat: me 도메인 구조 확립 및 사용자 조회 api 생성
3c31a72 feat: trade-posts 도메인 구조 확립 및 조회 api 생성
c18a765 feat: trade-requests 도메인 구조 확립 및 조회 api 생성
2cee1cf feat: me 도메인 구매 및 판매 요청 조회 api 생성
```
