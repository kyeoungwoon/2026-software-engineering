import type { SpringPageResponse } from "../common";

/**
 * 감사 로그(Audit Log) 도메인 타입.
 *
 * 백엔드 가이드: docs/be-guides/감사_로그_FE_API_가이드.md
 *
 * - `GET /api/v1/admin/audit-logs` 단일 엔드포인트.
 * - 응답은 `ApiResponse<Page<AuditLogInfo>>` (Spring Page 직렬화 형태).
 *   다른 가이드의 커스텀 `PageResponse<T>` 와 필드명이 다르다.
 * - 모든 필터는 optional · AND 조건. 정렬은 `createdAt DESC` 고정.
 * - 키워드 검색·targetType/targetId 필터·정렬 옵션은 미지원.
 */

/**
 * 백엔드 `Domain` enum (`com.umc.product.global.exception.constant.Domain`).
 * 전체 도메인이 노출되지만 실제 감사 로그를 발행하는 도메인은 일부 (현재는 SCHEDULE 위주).
 */
export type Domain =
  | "COMMON"
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "MEMBER"
  | "CHALLENGER"
  | "ORGANIZATION"
  | "CURRICULUM"
  | "SCHEDULE"
  | "COMMUNITY"
  | "NOTICE"
  | "FCM"
  | "SURVEY"
  | "RECRUITMENT"
  | "TERMS"
  | "EMAIL"
  | "STORAGE"
  | "WEBHOOK"
  | "AUDIT_LOG"
  | "PROJECT"
  | "FIGMA"
  | "LLM";

/**
 * 백엔드 `AuditAction` enum (`com.umc.product.audit.domain.AuditAction`).
 */
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "CHECK"
  | "SUBMIT"
  | "REGISTER"
  | "WITHDRAW";

/**
 * 단일 감사 로그 항목.
 * 가이드 §3.5 응답 본문(Result Item).
 *
 * - `targetId` 는 문자열. UUID·숫자 ID·컴포지트 key 어느 쪽도 올 수 있다.
 * - `actorMemberId` 는 nullable. 시스템/스케줄러 발신은 null → UI 에서 "시스템" 표시.
 * - `description` · `details` · `ipAddress` 모두 nullable.
 * - `createdAt` 은 ISO-8601 UTC.
 */
export interface AuditLogInfo {
  /** 백엔드는 Java Long 정밀도 보전을 위해 ID 를 numeric string 으로 직렬화해요. */
  id: string;
  domain: Domain;
  action: AuditAction;
  targetType: string | null;
  targetId: string | null;
  /** 시스템 발신이면 null, 회원이면 string (Long 정밀도). */
  actorMemberId: string | null;
  description: string | null;
  /**
   * jsonb. 현재는 빈 객체가 주로 들어오며, 향후 `{ "before": ..., "after": ... }`
   * 형태의 diff 가 들어올 수 있다. JSON 뷰어로 표시 권장.
   */
  details: string | Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

/**
 * 검색 쿼리 파라미터.
 * 빈 값은 쿼리 스트링에서 반드시 제외해야 한다 (서버는 null 만 인식).
 */
export interface SearchAuditLogQuery {
  domain?: Domain;
  action?: AuditAction;
  /**
   * 시스템 액션은 항상 null 이므로 이 필터로는 검색되지 않아요.
   * ID 는 string 으로 전송 (Long 정밀도 보전 정책).
   */
  actorMemberId?: string;
  /** ISO-8601 + 타임존 (예: `2026-05-12T00:00:00Z`). */
  from?: string;
  /** ISO-8601 + 타임존. `createdAt <= to` 포함 조건. */
  to?: string;
  /** 0-indexed. */
  page?: number;
  /** 기본 20. 200 이상 비권장. */
  size?: number;
}

/**
 * 감사 로그 엔드포인트의 `result` 는 Spring `Page<T>` 직렬화 형태이다.
 * 백오피스의 다른 페이지네이션 응답(`PageResponse<T>`)과 필드명이 다르므로 주의.
 *
 * 가이드 §3.2 참고.
 */
export type AuditLogPage = SpringPageResponse<AuditLogInfo>;
