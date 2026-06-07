/**
 * Figma 백오피스 도메인 타입.
 *
 * 가이드 기준:
 *   - 모든 endpoint prefix: `/api/v1/admin/figma/...`
 *   - 응답은 `ApiResponse<T>` 봉투에 감싸지므로 호출부에서 `data.result` 만 unwrap.
 *   - 모든 DB 식별자 (`id`, `domainId`, `watchedFileId`) 는 Java Long 정밀도
 *     보전을 위해 numeric string 으로 직렬화돼요 (`challenger` 피처와 동일한 정책).
 *     Discord snowflake (`mentionId`) 는 64bit ID 이므로 본래 string.
 */

export type DiscordMentionType = "ROLE" | "USER";

// =============================================================================
// Watched Files
// =============================================================================

export interface WatchedFile {
  id: string;
  fileKey: string;
  displayName: string;
  enabled: boolean;
  /** ISO8601 Instant. 미동기 상태면 null. */
  lastSyncedAt: string | null;
  /** 마지막 sync 에서 발생한 에러 메시지. 정상이면 null. */
  lastError: string | null;
}

export interface CreateWatchedFileRequest {
  fileKey: string;
  displayName: string;
}

export interface CreateWatchedFileResponse {
  watchedFileId: string;
}

export interface ListWatchedFilesParams {
  /** 미전달 시 전체 (활성/비활성 모두). */
  enabled?: boolean;
}

// =============================================================================
// Routing Domains & Mentions
// =============================================================================

export interface RoutingDomainMention {
  id: string;
  domainId: string;
  /** Discord role/user snowflake ID. 64bit 정밀도 보전을 위해 string. */
  mentionId: string;
  mentionType: DiscordMentionType;
  displayLabel: string | null;
}

export interface RoutingDomainListItem {
  id: string;
  domainKey: string;
  description: string | null;
  /** ADR-005 마스킹 정책. 원본 webhook URL 은 절대 노출되지 않음. */
  discordWebhookUrlMasked: string;
  fallback: boolean;
  mentionCount: number;
  /** list 응답에서는 항상 null (페이로드 통제). */
  mentions: null;
}

export interface RoutingDomainDetail extends Omit<
  RoutingDomainListItem,
  "mentions"
> {
  mentions: RoutingDomainMention[];
}

export interface CreateRoutingDomainRequest {
  domainKey: string;
  description?: string;
  discordWebhookUrl: string;
  fallback: boolean;
}

export interface CreateRoutingDomainResponse {
  domainId: string;
}

export interface AddMentionRequest {
  mentionId: string;
  mentionType: DiscordMentionType;
  displayLabel?: string;
}

/**
 * 응답 필드명이 request 와 동일한 `mentionId` 지만, **DB row id (string)** 가 들어와요.
 * Discord snowflake 가 아니라는 점에 주의해요. 가이드 §2.3 [FIGMA-013] 참고.
 */
export interface AddMentionResponse {
  mentionId: string;
}

/** `[FIGMA-019]` PATCH 도메인 수정. domainKey 는 변경 불가. */
export interface UpdateRoutingDomainRequest {
  description?: string;
  discordWebhookUrl: string;
  fallback: boolean;
}

/** `[FIGMA-020]` PATCH 멘션 수정. mentionType 변경은 삭제 후 재등록으로만 가능. */
export interface UpdateMentionRequest {
  mentionId: string;
  displayLabel?: string;
}

// =============================================================================
// OAuth
// =============================================================================

export interface OAuthAuthorizeUrlResponse {
  authorizeUrl: string;
  /** state 는 서버 세션에 묶여 있어 FE 가 별도 보관할 필요 없음. */
  state: string;
}

// =============================================================================
// Sync / Digest / Preview
// =============================================================================

export interface PreviewParams {
  /** ISO8601 Instant (e.g. `2026-05-08T03:00:00Z`). 미전달 시 백엔드 기본값. */
  from?: string;
  to?: string;
  watchedFileId?: string;
}

export interface DigestParams {
  /** 둘 다 필수. 잘못 입력 시 FIGMA-0017. */
  from: string;
  to: string;
}

/**
 * Preview 응답에 포함되는 댓글 단위.
 * `alreadyDispatched=true` 인 댓글은 다음 정기 sync 에서 제외됨 — UI 에서 회색 처리.
 */
export interface FigmaCommentItem {
  commentId: string;
  message: string;
  authorName: string;
  fileKey: string;
  fileDisplayName: string;
  nodeId: string;
  pageName: string | null;
  /** LLM 분류 결과. 매칭 실패 시 null 또는 fallback domain key. */
  classifiedDomainKey: string | null;
  createdAt: string;
  alreadyDispatched: boolean;
}

export interface FigmaSummaryDomain {
  domainKey: string;
  /** preview 응답은 마스킹되지 않은 원본 — 화면에는 노출 금지 (FE 자체 마스킹). */
  webhookUrl: string;
  fallback: boolean;
  /** 멘션 렌더 결과 (e.g. `<@&12345>`). */
  mentionRenders: string[];
  /** preview 에서는 false 로 고정 (실제 발송하지 않음). */
  sent: boolean;
  comments: FigmaCommentItem[];
}

export interface FigmaSummaryResult {
  from: string;
  to: string;
  totalComments: number;
  unmatchedCount: number;
  /** preview 응답에만 존재 (digest 응답에는 없음). */
  skippedAlreadyDispatchedCount?: number;
  domains: FigmaSummaryDomain[];
}

export interface FigmaDigestSummaryDomain {
  domainKey: string;
  commentCount: number;
  /** false 면 발송 실패 (Discord webhook 오류 등). 화면에서 빨간색 강조. */
  sent: boolean;
}

export interface FigmaDigestSummary {
  from: string;
  to: string;
  totalComments: number;
  unmatchedCount: number;
  domains: FigmaDigestSummaryDomain[];
}
