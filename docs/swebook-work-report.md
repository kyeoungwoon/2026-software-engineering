# SWEBook 작업 보고서

## 개요

SWEBook은 대학생이 사용하지 않는 전공 서적을 같은 학교 또는 가까운 지역 학생들과 직접 거래할 수 있도록 만든 위치 기반 중고 전공서 거래 플랫폼입니다.

이번 작업에서는 React 기반 모바일 프론트엔드, SQLite 데모 백엔드, 시드 데이터, 구매 요청 및 판매 요청 관리 흐름, 오류 상세 표시, 실행 문서를 순차적으로 구현했습니다.

## 요청 - 수행한 것 및 결과

### 1. 전공서 직거래 모바일 서비스를 만들어 달라는 요청

**요청**

대학생들이 사용하지 않는 전공 서적을 같은 학교 또는 근처 지역 학생들과 직접 거래할 수 있는 위치 기반 중고 도서 직거래 플랫폼을 만들고, UI는 당근과 비슷하게 구성하되 첨부된 모노레포 패키지의 디자인 시스템과 컴포넌트를 활용해 달라고 요청했습니다. React와 TanStack Router를 사용하고, 반응형보다는 모바일 화면에 최적화하기를 원했습니다.

**수행한 것 및 결과**

- `frontend/apps/mobile`에 React 19, Vite, TanStack Router 기반 모바일 앱을 구현했습니다.
- `@umc/ui`의 `Button`, `InputBox`, `Modal`, 스타일 토큰을 사용했습니다.
- 홈 피드, 동네 선택, 검색, 과목 칩, 판매글 상세, 로그인 모달, 판매글 등록 모달을 구현했습니다.
- 프론트 워크스페이스와 디자인 시스템 패키지를 분리해 커밋했습니다.

관련 커밋:

- `240e588 chore: add frontend workspace packages`
- `5c8087d feat: add swebook mobile marketplace app`

### 2. 확정된 SWEBook 모바일 프론트엔드 계획을 구현해 달라는 요청

**요청**

제공된 구현 계획에 따라 `frontend/apps/mobile`을 만들고, 홈 피드, 동네 선택 바텀시트, 로그인 모달, 판매글 등록 모달, 상세 화면, API 연동, Vite 프록시, Tailwind/UMC 스타일 설정까지 구현해 달라고 요청했습니다.

**수행한 것 및 결과**

- 프론트 워크스페이스를 `pnpm` 기반으로 구성했습니다.
- `apps/*`, `packages/*` 워크스페이스 구조를 만들었습니다.
- Vite 앱에서 `/api`, `/uploads`를 백엔드와 연결하도록 구성했습니다.
- SWEBook 백엔드 envelope 응답을 프론트에서 unwrap하는 API 레이어를 구현했습니다.
- 책 검색, 책 등록, 판매글 등록, 이미지 업로드, 구매 요청 생성 API를 연결했습니다.
- 과제용 로그인은 시드 사용자를 선택해 `localStorage`에 저장하는 방식으로 구현했습니다.

검증 결과:

- `pnpm --filter @swebook/mobile check` 통과
- `pnpm --filter @swebook/mobile build` 통과

### 3. 홈 탭, 상단 바, 하단 GNB, 폰트를 다듬어 달라는 요청

**요청**

관심, 채팅, 나의 탭이 왜 선택되지 않는지 확인하고, 상단 바의 padding bottom을 보정하며, 하단 GNB의 패딩과 문구를 조정하고, Pretendard 폰트 적용 여부를 확인해 달라고 요청했습니다.

**수행한 것 및 결과**

- 홈 내부 탭 상태를 추가해 관심목록, 채팅, 내 정보 탭이 선택되도록 수정했습니다.
- 상단 바에 안정적인 상하 패딩을 적용했습니다.
- 하단 GNB의 높이, safe-area padding, 문구를 정리했습니다.
- 앱 CSS에서 `Pretendard Variable`, `Pretendard`, 시스템 폰트 순서로 폰트 패밀리를 적용했습니다.
- 이후 채팅 기능은 구현 범위 밖이라는 점을 반영해 `채팅` 문구를 `요청내역`으로 바꾸고 거래 내역 페이지로 연결했습니다.

### 4. 백엔드를 MySQL 대신 SQLite로 공유 가능하게 바꿔 달라는 요청

**요청**

과제용으로 백엔드를 MySQL 대신 SQLite로 사용하고, Git을 통해 목데이터와 DB를 공유할 수 있게 해 달라고 요청했습니다. 또한 서비스 내 모든 기능을 활용할 수 있는 더미 데이터를 넣고, 언제든 초기화할 수 있게 하며, 각 과정을 커밋으로 남겨 달라고 요청했습니다.

**수행한 것 및 결과**

- 백엔드 datasource를 SQLite 기반으로 전환했습니다.
- `Backend/swebook/data/swebook.sqlite`를 Git 공유용 기본 DB로 구성했습니다.
- `db/sqlite/01-schema.sql`, `db/sqlite/02-seed.sql`을 추가했습니다.
- 사용자, 위치, 카테고리, 도서, 판매글, 이미지, 거래 가능 시간, 구매 요청 시드 데이터를 구성했습니다.
- `scripts/reset-sqlite-db.sh`를 추가해 언제든 초기 상태로 되돌릴 수 있게 했습니다.
- 업로드 이미지도 초기화 흐름에 포함했습니다.

관련 커밋:

- `07021ff chore: switch backend to sqlite`
- `c37a246 feat: add resettable sqlite demo data`
- `313e3fe docs: document sqlite demo workflow`
- `b469069 chore: reset uploaded trade images`
- `8e4c0e0 chore: refresh sqlite demo database`

### 5. 서버 요청이 5173으로 나가는 문제와 환경 설정을 확인해 달라는 요청

**요청**

서버 요청이 프론트 개발 서버 주소인 `5173`으로 나가고 있는데 `.env` 설정이 따로 있는지 확인해 달라고 요청했습니다.

**수행한 것 및 결과**

- 프론트 API 기본값을 `http://localhost:8080`으로 명확히 두었습니다.
- `VITE_API_BASE_URL`이 있으면 해당 값을 사용하고, 없으면 localhost 백엔드를 사용하도록 했습니다.
- 백엔드에 localhost/127.0.0.1 개발 환경용 CORS 설정을 추가했습니다.

관련 커밋:

- `77ed61a feat: add mobile support lookup APIs`

### 6. 프론트에만 있던 목데이터를 SQLite 서버 응답 기반으로 바꿔 달라는 요청

**요청**

프론트에서만 표시되던 목데이터를 실제 SQLite에 넣고, 서버 응답에 의해서만 화면에 표시되도록 변경해 달라고 요청했습니다.

**수행한 것 및 결과**

- 동네 프리셋을 `location_presets` 테이블에 저장했습니다.
- `/api/locations` API를 추가했습니다.
- 과제용 로그인 시드 사용자를 `/api/users` API로 조회하게 했습니다.
- 홈, 로그인, 판매글 등록, 상세 화면에서 서버 응답 기반 데이터를 사용하도록 연결했습니다.

관련 커밋:

- `77ed61a feat: add mobile support lookup APIs`
- `5c8087d feat: add swebook mobile marketplace app`

### 7. 구매 요청 시 404가 표시되는 문제를 테스트로 확인해 달라는 요청

**요청**

판매글 상세에서 구매 요청을 했을 때 404가 표시되므로, 자체 테스트를 제작해 수행하고 결과를 알려 달라고 요청했습니다.

**수행한 것 및 결과**

- `POST /api/trade-posts/18/requests`를 직접 재현했습니다.
- 판매글과 거래 가능 시간이 존재하는데도 `TRADE_REQUEST_404_002`가 반환되는 것을 확인했습니다.
- 원인은 SQLite에 저장된 날짜 문자열과 JPA derived query의 `LocalDateTime` DB 비교 방식 불일치였습니다.
- 거래 가능 시간을 DB 문자열 비교로 찾지 않고, 판매글의 거래 가능 시간 목록을 조회한 뒤 Java `LocalDateTime`으로 범위를 비교하도록 수정했습니다.
- 실제 HTTP 통합 테스트를 추가했습니다.

관련 커밋:

- `3775cdc fix: handle sqlite trade request time matching`

검증 결과:

- `./gradlew test --tests com.example.swebook.tradeposts.TradePostRequestIntegrationTest` 통과
- `./gradlew build` 통과
- 브라우저에서 구매 요청 성공 및 DB 반영 확인

### 8. 지금까지 작업을 커밋으로 나누고, 거래 관리 기능을 추가해 달라는 요청

**요청**

지금까지 진행한 작업을 커밋으로 나누고, 내가 보낸 구매 요청 이력을 볼 수 있게 하며, 채팅 버튼은 구매 요청 내역 페이지로 연결해 달라고 요청했습니다. 또한 내 판매 목록과 내 상품에 대한 구매 요청을 볼 수 있고, 판매자가 요청을 수락하거나 거절할 수 있어야 하며, 404나 409 오류가 표시될 때 상세한 사유를 제공하도록 요청했습니다.

**수행한 것 및 결과**

- 기존 미커밋 작업을 기능별로 분리해 커밋했습니다.
- `/api/me/sales/{userId}` API를 추가해 내 판매 목록을 조회할 수 있게 했습니다.
- 기존 `/api/me/trade-requests/{userId}`, `/api/me/sales/requests/{userId}`, `/api/trade-requests/{requestId}/accept`, `/api/trade-requests/{requestId}/reject` 흐름을 프론트에 연결했습니다.
- `/my/trades` 모바일 거래 내역 페이지를 추가했습니다.
- 거래 내역 페이지에 `구매 요청`, `판매 목록`, `받은 요청` 세그먼트 탭을 구현했습니다.
- 하단 GNB의 `채팅`을 `요청내역`으로 바꾸고, 해당 페이지로 이동하게 했습니다.
- 상세 화면의 채팅 아이콘 버튼도 구매 요청 내역 페이지로 연결했습니다.
- 받은 요청에서 `PENDING` 요청만 수락/거절할 수 있게 했습니다.
- 수락 후 요청은 `ACCEPTED`, 판매글은 `RESERVED`로 변경됨을 확인했습니다.
- 404/409 오류는 서버 메시지, 에러 코드, HTTP 상태를 함께 표시하도록 프론트 API 에러 처리를 개선했습니다.

관련 커밋:

- `0bc7f5f feat: add mobile trade management`

검증 결과:

- `./gradlew test --tests com.example.swebook.tradeposts.TradePostRequestIntegrationTest` 통과
- `./gradlew build` 통과
- `pnpm --filter @swebook/mobile check` 통과
- `pnpm --filter @swebook/mobile build` 통과
- 브라우저 DOM 검증 통과
  - `/my/trades?tab=requests`: 내가 보낸 구매 요청 표시
  - `/my/trades?tab=sales`: 내 판매 목록과 요청 수 표시
  - `/my/trades?tab=received`: 받은 요청과 수락/거절 버튼 표시
  - `/posts/2` 중복 구매 요청: `TRADE_REQUEST_409_001 · 409 Conflict` 표시
  - `/posts/999`: `TRADE_POST_404_001 · 404 Not Found` 표시

### 9. 보고서와 README를 작성해 달라는 요청

**요청**

중단된 부분이 있다면 계속 마무리하고, 처음부터 끝까지 요청했던 프롬프트를 말투만 다듬어 `요청 - 수행한 것 및 결과` 형식의 Markdown 보고서를 작성해 달라고 요청했습니다. 또한 README에 프로그램 실행 방법과 활용 방법, DB 관련 설명을 포함해 달라고 요청했습니다.

**수행한 것 및 결과**

- 이 보고서를 `docs/swebook-work-report.md`로 작성했습니다.
- 루트 `README.md`를 전체 프로젝트 실행 가이드로 확장했습니다.
- README에 백엔드 실행, 프론트 실행, SQLite DB 구조, DB 초기화, 데모 활용 방법, 테스트와 빌드 방법을 정리했습니다.

## 최종 실행 상태

검증 당시 실행 환경:

- 백엔드: `http://localhost:8080`
- 프론트엔드: `http://localhost:5173`
- 기본 API URL: `http://localhost:8080`
- 기본 DB: `Backend/swebook/data/swebook.sqlite`

## 최종 검증 명령

```bash
cd Backend/swebook
./gradlew test --tests com.example.swebook.tradeposts.TradePostRequestIntegrationTest
./gradlew build
```

```bash
cd frontend
pnpm --filter @swebook/mobile check
pnpm --filter @swebook/mobile build
```

## 남은 제한 사항

- 실제 회원가입, 비밀번호 로그인, JWT 인증은 구현하지 않았습니다.
- 채팅 기능은 구현하지 않았고, 요청내역 페이지로 대체했습니다.
- 결제와 지도 SDK는 구현하지 않았습니다.
- 브라우저 검증 중 마지막 스크린샷 캡처는 런타임 시간 초과가 있었지만, DOM 상태와 API 결과로 주요 기능은 확인했습니다.
