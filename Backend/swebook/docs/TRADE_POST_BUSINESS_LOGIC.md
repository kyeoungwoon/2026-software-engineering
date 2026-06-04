# Trade Post 비즈니스 로직 정리

## 개요

`trade-posts` 도메인은 전공서적 직거래 판매글의 등록, 조회, 이미지 업로드, 거래 가능 시간 조회, 구매 요청 생성, 상태 변경, 삭제를 담당한다.

핵심 구현 위치:

- Controller: `src/main/java/com/example/swebook/tradeposts/controller/TradePostController.java`
- Service: `src/main/java/com/example/swebook/tradeposts/service/TradePostService.java`
- Entity: `src/main/java/com/example/swebook/tradeposts/entity`
- Repository: `src/main/java/com/example/swebook/tradeposts/repository`

## API 엔드포인트

```java
@Tag(name = "Trade Posts", description = "판매글 등록, 조회, 이미지 업로드, 상태 변경, 삭제 API")
@RestController
@RequestMapping("/api/trade-posts")
public class TradePostController {
    ...
}
```

주요 엔드포인트:

- `POST /api/trade-posts`: 판매글 등록
- `POST /api/trade-posts/{postId}/images`: 판매글 이미지 업로드
- `GET /api/trade-posts/{postId}`: 판매글 상세 조회
- `GET /api/trade-posts/search`: 주변 판매글 검색
- `GET /api/trade-posts/{postId}/available-times`: 거래 가능 시간 조회
- `POST /api/trade-posts/{postId}/requests`: 구매 요청 생성
- `PATCH /api/trade-posts/{postId}/status`: 판매글 상태 변경
- `DELETE /api/trade-posts/{postId}`: 판매글 삭제

## 판매글 등록

Endpoint: `POST /api/trade-posts`

판매글 등록 시 판매자, 도서, 카테고리, 가격, 설명, 거래 장소, 위도, 경도, 거래 가능 시간을 함께 저장한다. 이미지는 등록 API에서 받지 않고, 별도 이미지 업로드 API에서 처리한다.

Controller 핵심 코드:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ApiResponse<CreateTradePostResponse> createTradePost(
        @Valid @RequestBody CreateTradePostRequest request
) {
    return ApiResponse.success(
            tradePostService.createTradePost(request),
            TradePostSuccessCode.TRADE_POST_CREATED
    );
}
```

Service 핵심 코드:

```java
@Transactional
public CreateTradePostResponse createTradePost(CreateTradePostRequest request) {
    User seller = userRepository.findById(request.sellerId())
            .orElseThrow(() -> new BusinessException(MeErrorCode.USER_NOT_FOUND));
    Book book = bookRepository.findById(request.bookId())
            .orElseThrow(() -> new BusinessException(BookErrorCode.BOOK_NOT_FOUND));
    Category category = categoryRepository.findById(request.categoryCode())
            .orElseThrow(() -> new BusinessException(CategoryErrorCode.CATEGORY_NOT_FOUND));

    TradePost tradePost = tradePostRepository.saveAndFlush(TradePost.create(
            seller,
            book,
            category,
            request.price(),
            request.description(),
            request.placeName(),
            request.latitude(),
            request.longitude(),
            DEFAULT_RADIUS
    ));

    List<TradeAvailableTime> availableTimes = request.availableTimes().stream()
            .map(availableTime -> TradeAvailableTime.create(
                    tradePost,
                    availableTime.startAt(),
                    validateAvailableTimeEndAfterStart(availableTime)
            ))
            .toList();
    List<TradeAvailableTime> savedAvailableTimes = tradeAvailableTimeRepository.saveAllAndFlush(availableTimes);

    return CreateTradePostResponse.from(tradePost, request.detailAddress(), savedAvailableTimes);
}
```

거래 가능 시간 검증 코드:

```java
private LocalDateTime validateAvailableTimeEndAfterStart(CreateTradePostRequest.AvailableTimeRequest availableTime) {
    if (!availableTime.startAt().isBefore(availableTime.endAt())) {
        throw new BusinessException(CommonErrorCode.INVALID_REQUEST);
    }

    return availableTime.endAt();
}
```

핵심 포인트:

- 판매자, 도서, 카테고리가 실제 DB에 존재해야 판매글을 생성한다.
- 판매글 최초 상태는 `AVAILABLE`이다.
- 거래 가능 시간은 `startAt < endAt` 조건을 만족해야 한다.
- `detailAddress`는 현재 DB 컬럼이 없어 응답 호환용으로만 사용한다.
- 기본 거래 반경은 `DEFAULT_RADIUS = 300`이다.

## 판매글 이미지 업로드

Endpoint: `POST /api/trade-posts/{postId}/images`

이미 생성된 판매글에 이미지를 업로드한다. 요청은 `multipart/form-data`이고, `images` 필드에 하나 이상의 파일을 전달한다.

Controller 핵심 코드:

```java
@PostMapping(value = "/{postId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@ResponseStatus(HttpStatus.CREATED)
public ApiResponse<UploadTradePostImagesResponse> uploadTradePostImages(
        @PathVariable Long postId,
        @RequestPart("images") List<MultipartFile> images
) {
    return ApiResponse.success(
            tradePostService.uploadTradePostImages(postId, images),
            TradePostSuccessCode.TRADE_POST_IMAGES_UPLOADED
    );
}
```

Service 핵심 코드:

```java
@Transactional
public UploadTradePostImagesResponse uploadTradePostImages(Long postId, List<MultipartFile> images) {
    if (images == null || images.isEmpty() || images.stream().anyMatch(MultipartFile::isEmpty)) {
        throw new BusinessException(CommonErrorCode.INVALID_REQUEST);
    }

    TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
            .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    AtomicInteger nextSortOrder = new AtomicInteger(Math.toIntExact(bookImageRepository.countByTradePostPostId(postId)));
    Path postUploadDirectory = Path.of(UPLOAD_DIRECTORY, "trade-posts", String.valueOf(postId))
            .toAbsolutePath()
            .normalize();
    createDirectories(postUploadDirectory);

    List<BookImage> bookImages = images.stream()
            .map(image -> saveBookImage(tradePost, image, postUploadDirectory, nextSortOrder.getAndIncrement()))
            .toList();
    List<BookImage> savedImages = bookImageRepository.saveAllAndFlush(bookImages);

    return UploadTradePostImagesResponse.of(postId, savedImages);
}
```

파일 저장 핵심 코드:

```java
private BookImage saveBookImage(
        TradePost tradePost,
        MultipartFile image,
        Path postUploadDirectory,
        int sortOrder
) {
    String fileName = UUID.randomUUID() + getFileExtension(image.getOriginalFilename());
    Path filePath = postUploadDirectory.resolve(fileName).normalize();

    try {
        image.transferTo(filePath);
    } catch (IOException e) {
        throw new BusinessException(CommonErrorCode.INTERNAL_SERVER_ERROR);
    }

    String imageUrl = "/uploads/trade-posts/" + tradePost.getPostId() + "/" + fileName;
    return BookImage.create(tradePost, imageUrl, sortOrder);
}
```

핵심 포인트:

- 이미지가 없거나 빈 파일이면 `INVALID_REQUEST`로 처리한다.
- 로컬 저장 경로는 `uploads/trade-posts/{postId}`이다.
- 파일명은 UUID 기반으로 생성해 이름 충돌을 줄인다.
- DB에는 실제 파일이 아니라 접근 가능한 URL 형태의 문자열을 저장한다.
- `sortOrder = 0`인 이미지를 대표 이미지로 본다.

## 판매글 상세 조회

Endpoint: `GET /api/trade-posts/{postId}`

판매글 상세 정보, 판매자, 도서, 카테고리, 이미지, 거래 가능 시간을 함께 반환한다.

Controller 핵심 코드:

```java
@GetMapping("/{postId}")
public ApiResponse<TradePostDetailResponse> getTradePost(
        @PathVariable Long postId
) {
    return ApiResponse.success(
            tradePostService.getTradePost(postId),
            TradePostSuccessCode.TRADE_POST_FOUND
    );
}
```

Service 핵심 코드:

```java
public TradePostDetailResponse getTradePost(Long postId) {
    TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
            .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    List<BookImage> images = bookImageRepository.findByTradePostPostIdOrderBySortOrderAsc(postId);
    List<TradeAvailableTime> availableTimes = tradeAvailableTimeRepository.findByTradePostPostIdOrderByStartAtAsc(postId);

    return TradePostDetailResponse.from(tradePost, images, availableTimes);
}
```

Repository 핵심 코드:

```java
@EntityGraph(attributePaths = {"seller", "book", "category"})
Optional<TradePost> findByPostIdAndDeletedAtIsNull(Long postId);
```

핵심 포인트:

- `deletedAt`이 null인 판매글만 상세 조회 대상이다.
- soft delete된 판매글은 찾을 수 없는 판매글로 처리한다.
- 이미지는 `sortOrder` 오름차순으로 반환한다.
- 거래 가능 시간은 `startAt` 오름차순으로 반환한다.

## 주변 판매글 검색

Endpoint: `GET /api/trade-posts/search`

사용자 현재 위치와 카테고리 코드를 기준으로 판매글을 조회하고, 사용자와 판매글 사이의 거리가 짧은 순서대로 반환한다.

Controller 핵심 코드:

```java
@GetMapping("/search")
public ApiResponse<NearbyTradePostsResponse> getNearbyTradePosts(
        @RequestParam BigDecimal latitude,
        @RequestParam BigDecimal longitude,
        @RequestParam String categoryCode,
        @RequestParam(required = false) String bookTitle,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
) {
    return ApiResponse.success(
            tradePostService.getNearbyTradePosts(latitude, longitude, categoryCode, bookTitle, page, size),
            TradePostSuccessCode.NEARBY_TRADE_POSTS_FOUND
    );
}
```

Service 핵심 코드:

```java
public NearbyTradePostsResponse getNearbyTradePosts(
        BigDecimal latitude,
        BigDecimal longitude,
        String categoryCode,
        String bookTitle,
        int page,
        int size
) {
    if (page < 0 || size <= 0) {
        throw new BusinessException(CommonErrorCode.INVALID_REQUEST);
    }

    List<TradePostWithDistance> posts = tradePostRepository.findByDeletedAtIsNullAndCategoryCategoryCode(categoryCode)
            .stream()
            .map(tradePost -> TradePostWithDistance.from(
                    tradePost,
                    calculateDistanceMeter(latitude, longitude, tradePost.getLatitude(), tradePost.getLongitude())
            ))
            .sorted(Comparator.comparingLong(TradePostWithDistance::distanceMeter))
            .toList();

    Map<Long, BookImage> coverImages = getCoverImages(posts.stream()
            .map(TradePostWithDistance::tradePost)
            .map(TradePost::getPostId)
            .toList());
    int fromIndex = Math.min(page * size, posts.size());
    int toIndex = Math.min(fromIndex + size, posts.size());

    List<NearbyTradePostsResponse.PostItem> items = posts.subList(fromIndex, toIndex)
            .stream()
            .map(post -> NearbyTradePostsResponse.PostItem.from(
                    post.tradePost(),
                    post.distanceMeter(),
                    coverImages.get(post.tradePost().getPostId())
            ))
            .toList();

    return NearbyTradePostsResponse.of(
            items,
            NearbyTradePostsResponse.PageInfo.of(page, size, posts.size())
    );
}
```

거리 계산 핵심 코드:

```java
private long calculateDistanceMeter(
        BigDecimal userLatitude,
        BigDecimal userLongitude,
        BigDecimal postLatitude,
        BigDecimal postLongitude
) {
    double userLatitudeRadians = Math.toRadians(userLatitude.doubleValue());
    double postLatitudeRadians = Math.toRadians(postLatitude.doubleValue());
    double latitudeDifference = Math.toRadians(postLatitude.subtract(userLatitude).doubleValue());
    double longitudeDifference = Math.toRadians(postLongitude.subtract(userLongitude).doubleValue());
    double haversine = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2)
            + Math.cos(userLatitudeRadians) * Math.cos(postLatitudeRadians)
            * Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);
    double angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return Math.round(EARTH_RADIUS_METER * angularDistance);
}
```

대표 이미지 조회 핵심 코드:

```java
private Map<Long, BookImage> getCoverImages(Collection<Long> postIds) {
    if (postIds.isEmpty()) {
        return Map.of();
    }

    return bookImageRepository.findByTradePostPostIdInAndSortOrder(postIds, 0)
            .stream()
            .collect(Collectors.toMap(
                    image -> image.getTradePost().getPostId(),
                    Function.identity()
            ));
}
```

핵심 포인트:

- `page < 0`, `size <= 0`은 잘못된 요청으로 처리한다.
- 현재는 `categoryCode` 기준으로만 판매글을 필터링한다.
- `bookTitle`은 API 확장을 위해 받지만 아직 필터 조건으로 사용하지 않는다.
- 거리 계산은 Haversine 공식을 사용한다.
- 거리 정렬과 페이지네이션은 애플리케이션 메모리에서 수행한다.

## 거래 가능 시간 조회

Endpoint: `GET /api/trade-posts/{postId}/available-times`

판매글의 거래 가능 시간 목록과 각 시간이 이미 구매 요청에 사용되었는지 여부를 반환한다.

Controller 핵심 코드:

```java
@GetMapping("/{postId}/available-times")
public ApiResponse<AvailableTimeResponse> getAvailableTimes(
        @PathVariable Long postId
) {
    return ApiResponse.success(
            tradePostService.getAvailableTimes(postId),
            TradePostSuccessCode.AVAILABLE_TIMES_FOUND
    );
}
```

Service 핵심 코드:

```java
public AvailableTimeResponse getAvailableTimes(Long postId) {
    if (!tradePostRepository.existsById(postId)) {
        throw new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND);
    }

    List<TradeAvailableTime> availableTimes = tradeAvailableTimeRepository.findByTradePostPostIdOrderByStartAtAsc(postId);
    List<Long> availableTimeIds = availableTimes.stream()
            .map(TradeAvailableTime::getAvailableTimeId)
            .toList();
    Set<Long> requestedAvailableTimeIds = tradePostRequestLookupRepository.findByAvailableTimeAvailableTimeIdIn(availableTimeIds)
            .stream()
            .map(TradeRequest::getAvailableTime)
            .map(TradeAvailableTime::getAvailableTimeId)
            .collect(Collectors.toSet());

    List<AvailableTimeResponse.AvailableTimeItem> items = availableTimes.stream()
            .map(availableTime -> AvailableTimeResponse.AvailableTimeItem.from(
                    availableTime,
                    requestedAvailableTimeIds.contains(availableTime.getAvailableTimeId())
            ))
            .toList();

    return AvailableTimeResponse.of(postId, items);
}
```

핵심 포인트:

- 판매글에 연결된 거래 가능 시간을 조회한다.
- 이미 구매 요청에 사용된 시간은 `isRequested = true`로 표시한다.
- `isRequested` 계산은 `trade_requests.available_time_id` 연결 여부로 판단한다.

## 구매 요청 생성

Endpoint: `POST /api/trade-posts/{postId}/requests`

사용자가 특정 판매글에 대해 구매 요청을 생성한다.

Controller 핵심 코드:

```java
@PostMapping("/{postId}/requests")
@ResponseStatus(HttpStatus.CREATED)
public ApiResponse<CreateTradeRequestResponse> createTradeRequest(
        @PathVariable Long postId,
        @Valid @RequestBody CreateTradeRequestRequest request
) {
    return ApiResponse.success(
            tradePostService.createTradeRequest(postId, request),
            TradePostSuccessCode.TRADE_REQUEST_CREATED
    );
}
```

Service 핵심 코드:

```java
@Transactional
public CreateTradeRequestResponse createTradeRequest(Long postId, CreateTradeRequestRequest request) {
    TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
            .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    User buyer = userRepository.findById(request.userId())
            .orElseThrow(() -> new BusinessException(MeErrorCode.USER_NOT_FOUND));

    if (tradePost.getSeller().getUserId().equals(buyer.getUserId())) {
        throw new BusinessException(TradeRequestErrorCode.SELLER_CANNOT_REQUEST_OWN_POST);
    }

    if (tradeRequestRepository.existsByUserUserIdAndTradePostPostId(buyer.getUserId(), postId)) {
        throw new BusinessException(TradeRequestErrorCode.DUPLICATE_TRADE_REQUEST);
    }

    TradeAvailableTime availableTime = tradeAvailableTimeRepository
            .findFirstByTradePostPostIdAndStartAtLessThanEqualAndEndAtGreaterThan(
                    postId,
                    request.availableTime(),
                    request.availableTime()
            )
            .orElseThrow(() -> new BusinessException(TradeRequestErrorCode.AVAILABLE_TIME_NOT_FOUND));
    TradeRequest tradeRequest = tradeRequestRepository.saveAndFlush(
            TradeRequest.create(buyer, tradePost, availableTime)
    );

    return CreateTradeRequestResponse.from(tradeRequest, request.availableTime());
}
```

핵심 포인트:

- 판매자는 자신의 판매글에 구매 요청을 만들 수 없다.
- 같은 구매자는 같은 판매글에 중복 요청할 수 없다.
- 요청 시간이 거래 가능 시간 범위에 포함되어야 한다.
- 포함 조건은 repository 메서드명 기준으로 `startAt <= availableTime < endAt`이다.
- 구매 요청은 `TradeRequest.create(...)`를 통해 기본 상태 `PENDING`으로 생성된다.

## 판매글 상태 변경

Endpoint: `PATCH /api/trade-posts/{postId}/status`

판매글 상태를 `AVAILABLE`, `RESERVED`, `SOLD` 중 하나로 변경한다.

Controller 핵심 코드:

```java
@PatchMapping("/{postId}/status")
public ApiResponse<UpdateTradePostStatusResponse> updateTradePostStatus(
        @PathVariable Long postId,
        @Valid @RequestBody UpdateTradePostStatusRequest request
) {
    return ApiResponse.success(
            tradePostService.updateTradePostStatus(postId, request),
            TradePostSuccessCode.TRADE_POST_STATUS_UPDATED
    );
}
```

Service 핵심 코드:

```java
@Transactional
public UpdateTradePostStatusResponse updateTradePostStatus(Long postId, UpdateTradePostStatusRequest request) {
    TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
            .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    tradePost.updateStatus(request.status());

    return UpdateTradePostStatusResponse.from(tradePost);
}
```

Entity 핵심 코드:

```java
public void updateStatus(TradePostStatus status) {
    this.status = status;
}
```

핵심 포인트:

- 삭제되지 않은 판매글만 상태 변경 가능하다.
- 상태 전이 규칙은 현재 별도로 제한하지 않는다.
- 요청 DTO의 enum 타입으로 허용 가능한 상태 값을 제한한다.

## 판매글 삭제

Endpoint: `DELETE /api/trade-posts/{postId}`

판매글을 물리 삭제하지 않고 `deletedAt`만 기록하는 soft delete 방식으로 처리한다.

Controller 핵심 코드:

```java
@DeleteMapping("/{postId}")
public ApiResponse<DeleteTradePostResponse> deleteTradePost(
        @PathVariable Long postId
) {
    return ApiResponse.success(
            tradePostService.deleteTradePost(postId),
            TradePostSuccessCode.TRADE_POST_DELETED
    );
}
```

Service 핵심 코드:

```java
@Transactional
public DeleteTradePostResponse deleteTradePost(Long postId) {
    TradePost tradePost = tradePostRepository.findByPostIdAndDeletedAtIsNull(postId)
            .orElseThrow(() -> new BusinessException(TradePostErrorCode.TRADE_POST_NOT_FOUND));
    tradePost.delete(LocalDateTime.now());

    return DeleteTradePostResponse.from(tradePost);
}
```

Entity 핵심 코드:

```java
public void delete(LocalDateTime deletedAt) {
    this.deletedAt = deletedAt;
}
```

핵심 포인트:

- 실제 row를 삭제하지 않는다.
- `deletedAt`이 채워진 판매글은 상세 조회, 목록 조회, 검색에서 제외된다.
- 조회 repository는 대부분 `findByPostIdAndDeletedAtIsNull`, `findByDeletedAtIsNull...` 조건을 사용한다.

## Entity 핵심 구조

`TradePost`는 판매자, 도서, 카테고리와 다대일 관계를 가진다.

```java
@Entity
@Table(name = "trade_posts")
public class TradePost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_code", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TradePostStatus status;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
```

판매글 생성 코드:

```java
public static TradePost create(
        User seller,
        Book book,
        Category category,
        Integer price,
        String description,
        String placeName,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer radius
) {
    TradePost tradePost = new TradePost();
    tradePost.seller = seller;
    tradePost.book = book;
    tradePost.category = category;
    tradePost.price = price;
    tradePost.description = description;
    tradePost.status = TradePostStatus.AVAILABLE;
    tradePost.placeName = placeName;
    tradePost.latitude = latitude;
    tradePost.longitude = longitude;
    tradePost.radius = radius;
    tradePost.createdAt = LocalDateTime.now();
    tradePost.updatedAt = tradePost.createdAt;
    return tradePost;
}
```

## Repository 핵심 구조

```java
public interface TradePostRepository extends JpaRepository<TradePost, Long> {

    @EntityGraph(attributePaths = {"seller", "book", "category"})
    List<TradePost> findByDeletedAtIsNullOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"seller", "book", "category"})
    List<TradePost> findByDeletedAtIsNullAndCategoryCategoryCode(String categoryCode);

    @EntityGraph(attributePaths = {"seller", "book", "category"})
    Optional<TradePost> findByPostIdAndDeletedAtIsNull(Long postId);
}
```

핵심 포인트:

- `@EntityGraph`로 판매자, 도서, 카테고리를 함께 조회해 상세/목록 응답에서 필요한 관계 데이터를 가져온다.
- soft delete를 고려해 조회 조건에 `DeletedAtIsNull`을 붙인다.
- 검색 API는 `categoryCode` 기준 조회 후 서비스에서 거리 계산을 수행한다.

## 공통 응답과 에러 처리

trade-posts API는 공통 응답 구조인 `ApiResponse<T>`를 사용한다.

```java
return ApiResponse.success(
        tradePostService.getTradePost(postId),
        TradePostSuccessCode.TRADE_POST_FOUND
);
```

주요 성공 코드:

- `TRADE_POST_CREATED`: 판매글 등록 성공
- `TRADE_POST_FOUND`: 판매글 상세 조회 성공
- `AVAILABLE_TIMES_FOUND`: 거래 가능 시간 조회 성공
- `TRADE_REQUEST_CREATED`: 구매 요청 생성 성공
- `TRADE_POST_IMAGES_UPLOADED`: 이미지 업로드 성공
- `TRADE_POST_STATUS_UPDATED`: 상태 변경 성공
- `TRADE_POST_DELETED`: 판매글 삭제 성공
- `NEARBY_TRADE_POSTS_FOUND`: 주변 판매글 조회 성공

주요 에러 코드:

- `TRADE_POST_NOT_FOUND`: 판매글을 찾을 수 없음
- `INVALID_REQUEST`: 잘못된 요청
- `USER_NOT_FOUND`: 사용자 없음
- `BOOK_NOT_FOUND`: 도서 없음
- `CATEGORY_NOT_FOUND`: 카테고리 없음
- `SELLER_CANNOT_REQUEST_OWN_POST`: 판매자 본인 구매 요청
- `DUPLICATE_TRADE_REQUEST`: 중복 구매 요청
- `AVAILABLE_TIME_NOT_FOUND`: 요청 시간이 거래 가능 시간 범위에 없음

## Swagger 문서화

trade-posts API는 Swagger 문서화를 제공한다.

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Controller에는 API 단위 설명을, DTO에는 요청 및 응답 필드 설명과 예시를 정의한다.

```java
@Operation(
        summary = "주변 판매글 검색",
        description = "사용자 현재 위치와 categoryCode를 기준으로 판매글을 조회하고, 각 판매글과 사용자 위치 사이의 거리를 계산해 가까운 순서로 반환합니다. bookTitle은 현재 입력만 받고 필터에는 적용하지 않습니다."
)
```
