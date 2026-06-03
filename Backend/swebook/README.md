# swebook

Spring Boot 기반 백엔드 프로젝트입니다.

## 기술 스택

- Java 17
- Spring Boot 4.0.6
- Spring Web MVC
- Spring Data JPA
- Spring Validation
- MySQL 8.4
- Gradle 9.5.1
- Docker Compose
- Lombok

## 사전 준비

- Docker Desktop
- Java 17 이상

프로젝트는 Gradle Java Toolchain을 사용합니다. 로컬에 Java 17이 없으면 Gradle이 toolchain resolver를 통해 Java 17을 내려받아 사용할 수 있습니다.

## MySQL 실행

MySQL은 `docker-compose.yml`로 실행합니다.

```bash
docker compose up -d
```

컨테이너 상태 확인:

```bash
docker compose ps
```

MySQL 중지:

```bash
docker compose down
```

MySQL 데이터까지 삭제:

```bash
docker compose down -v
```

## DB 접속 정보

```text
Host: localhost
Port: 3306
Database: swebook
User: swebook_user
Password: swebook_password
Root Password: root_password
```

Spring Boot datasource 설정은 `src/main/resources/application.properties`에 로컬 개발용으로 직접 명시되어 있습니다.

## 프로젝트 실행

먼저 MySQL을 실행합니다.

```bash
docker compose up -d
```

그 다음 Spring Boot 애플리케이션을 실행합니다.

```bash
./gradlew bootRun
```

기본 실행 주소:

```text
http://localhost:8080
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

- `build.gradle`: Gradle 빌드 및 의존성 설정
- `settings.gradle`: 프로젝트 이름 및 Java toolchain resolver 설정
- `docker-compose.yml`: 로컬 MySQL 컨테이너 설정
- `src/main/resources/application.properties`: Spring Boot 및 MySQL 연결 설정
