/**
 * 운영진 대시보드 도메인 타입.
 *
 * 백엔드 가이드: docs/be-guides/운영진_대시보드_FE_API_가이드.md
 *
 * 엔드포인트:
 * - `GET /v1/admin/dashboard/context` → 호출자 권한·스코프
 * - `GET /v1/admin/dashboard/summary` → 상단 KPI 5종
 * - `GET /v1/admin/dashboard/action-queue` → 처리 대기 액션 3종
 * - `GET /v1/admin/dashboard/operations` → 운영 현황 종합
 * - `GET /v1/admin/dashboard/risk-challengers` → 위험군 챌린저 (paginated)
 * - `GET /v1/admin/schools/summary` → 학교별 현황 (paginated)
 *
 * 직렬화 규약:
 * - 모든 ID (`*Id`) 는 Java Long 정밀도 보전을 위해 numeric string 으로 직렬화돼요.
 *   FE 도 ID 는 항상 string 으로 다뤄요 (`challenger` 피처와 동일한 정책).
 * - count / sum / percent 같은 숫자 필드도 number 또는 numeric string 으로 올 수
 *   있으므로 표시 단계에서 `formatCount` / `formatDecimal` / `toNumberSafe` 로 정규화해요.
 *
 * 페이지네이션 응답은 `PageResponse<T>` 구조이며, 감사 로그(Spring Page) 와
 * 필드명이 다르다 (`page` / `hasNext` / `hasPrevious` vs `number` / `first` / `last`).
 */

import type { PageResponse } from "../common";
import type { Part } from "./challenger";

/* -------------------------------------------------------------------------- */
/* 공통                                                                       */
/* -------------------------------------------------------------------------- */

export type ChallengerStatus =
  | "ACTIVE"
  | "GRADUATED"
  | "EXPELLED"
  | "WITHDRAWN";

export type AdminAnalyticsScopeType =
  | "CENTRAL"
  | "CHAPTER"
  | "SCHOOL"
  | "SCHOOL_PART";

export type ChallengerRoleType =
  | "SUPER_ADMIN"
  | "CENTRAL_PRESIDENT"
  | "CENTRAL_VICE_PRESIDENT"
  | "CENTRAL_OPERATING_TEAM_MEMBER"
  | "CENTRAL_EDUCATION_TEAM_MEMBER"
  | "CHAPTER_PRESIDENT"
  | "SCHOOL_PRESIDENT"
  | "SCHOOL_VICE_PRESIDENT"
  | "SCHOOL_PART_LEADER"
  | "SCHOOL_ETC_ADMIN"
  | "CHALLENGER";

/**
 * 가이드 §1 응답 envelope. 페이지네이션은 `result` 위치에 이 구조가 들어온다.
 * 감사 로그가 쓰는 Spring `Page<T>` 와 필드명이 다르므로 별도 타입을 둔다.
 */
export type { PageResponse };

/* -------------------------------------------------------------------------- */
/* 권한 컨텍스트                                                              */
/* -------------------------------------------------------------------------- */

/** 가이드 §4.4 `[ADMIN-DASHBOARD-004]` */
export interface DashboardContext {
  roleType: ChallengerRoleType;
  gisuId: string | null;
  chapterId: string | null;
  schoolId: string | null;
  responsiblePart: Part | null;
  scopeType: AdminAnalyticsScopeType;
}

/* -------------------------------------------------------------------------- */
/* 상단 KPI 요약                                                              */
/* -------------------------------------------------------------------------- */

/** 가이드 §4.1 `[ADMIN-DASHBOARD-001]` */
export interface DashboardSummary {
  activeChallengerCount: number | string;
  newMemberCountThisWeek: number | string;
  newMemberDeltaPercent: number | string;
  activeSchoolCount: number | string;
  activeChapterCount: number | string;
  monthlyPointSum: {
    positive: number | string;
    negative: number | string;
  };
  /** 누락 키는 0으로 채워져 항상 4개 키가 모두 들어와요. */
  challengerStatusDistribution: Record<ChallengerStatus, number | string>;
}

export interface SummaryQuery {
  gisuId?: string;
  chapterId?: string;
  schoolId?: string;
}

/* -------------------------------------------------------------------------- */
/* 액션 큐                                                                    */
/* -------------------------------------------------------------------------- */

/** 가이드 §4.2 `[ADMIN-DASHBOARD-002]` */
export interface DashboardActionQueue {
  pendingAttendanceDecisionCount: number | string;
  newRiskMemberCountThisWeek: number | string;
  upcomingGraduationCount: number | string;
}

export interface ActionQueueQuery {
  gisuId?: string;
  /** 기본 -8. */
  riskThreshold?: number;
}

/* -------------------------------------------------------------------------- */
/* 위험군 챌린저                                                              */
/* -------------------------------------------------------------------------- */

export type PointType = string;

/** 가이드 §4.3 `[ADMIN-DASHBOARD-003]` */
export interface RiskChallenger {
  challengerId: string;
  memberId: string;
  name: string;
  schoolName: string;
  part: Part;
  pointSum: number | string;
  latestNegativePoint: {
    pointType: PointType;
    createdAt: string;
    score: number | string;
  } | null;
}

export interface RiskChallengersQuery {
  gisuId?: string;
  chapterId?: string;
  schoolId?: string;
  riskThreshold?: number;
  page?: number;
  size?: number;
  /** 예: `pointSum,asc`. */
  sort?: string;
}

/* -------------------------------------------------------------------------- */
/* 운영 현황 종합                                                             */
/* -------------------------------------------------------------------------- */

export interface ChapterSchoolStatus {
  chapterId: string;
  chapterName: string;
  schools: Array<{
    schoolId: string;
    schoolName: string;
    totalChallengerCount: number | string;
    challengerPartCounts: Partial<Record<Part, number | string>>;
  }>;
}

export interface ChapterPartPointGrantStatus {
  chapterId: string;
  chapterName: string;
  part: Part;
  grantCount: number | string;
  pointSum: number | string;
}

/**
 * 출석 상태 enum 의 일부. 백엔드에 항목이 추가될 수 있어 string union 으로 받고
 * UI 에서는 라벨 매핑이 없는 키도 "기타" 로 안전하게 보여준다.
 */
export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EXCUSED"
  | "PRESENT_PENDING"
  | "LATE_PENDING"
  | "EXCUSED_PENDING"
  | "ABSENT_EXCUSE_PENDING"
  | "LATE_EXCUSE_PENDING"
  | (string & {});

export interface ScheduleAttendanceStatus {
  scheduleCount: number | string;
  attendanceRequiredScheduleCount: number | string;
  attendanceRecordCount: number | string;
  attendanceStatusCounts: Record<AttendanceStatus, number | string>;
}

export interface StudyGroupStatus {
  studyGroupCount: number | string;
  studyGroupScheduleCount: number | string;
}

export interface SignupBucket {
  /** `YYYY-MM-DD`. */
  date: string;
  count: number | string;
}

/** 가이드 §4.5 `[ADMIN-DASHBOARD-005]` */
export interface DashboardOperations {
  chapterSchoolStatuses: ChapterSchoolStatus[];
  pointGrantStatuses: ChapterPartPointGrantStatus[];
  scheduleAttendanceStatus: ScheduleAttendanceStatus;
  studyGroupStatus: StudyGroupStatus;
  signupBuckets: SignupBucket[];
}

export interface OperationsQuery {
  gisuId?: string;
  /** ISO-8601 UTC. 기본은 `to - 30일`. */
  from?: string;
  /** ISO-8601 UTC. 기본은 현재 시각. `from < to` 필요. */
  to?: string;
}

/* -------------------------------------------------------------------------- */
/* 학교별 현황                                                                */
/* -------------------------------------------------------------------------- */

export type SchoolSummarySort =
  | "riskChallengerCount,desc"
  | "activeChallengerCount,desc"
  | "schoolName,asc"
  | "averagePointSum,asc"
  | "averagePointSum,desc";

export interface SchoolSummary {
  schoolId: string;
  schoolName: string;
  chapterId: string;
  chapterName: string;
  activeChallengerCount: number | string;
  president: { challengerId: string; name: string } | null;
  vicePresident: { challengerId: string; name: string } | null;
  partLeaderRatio: {
    assigned: number | string;
    totalRunningParts: number | string;
  };
  averagePointSum: number | string;
  riskChallengerCount: number | string;
  newMemberCountThisWeek: number | string;
}

export interface SchoolSummaryQuery {
  gisuId?: string;
  chapterId?: string;
  /** 학교명 부분 일치 검색. */
  search?: string;
  riskThreshold?: number;
  sort?: SchoolSummarySort;
  page?: number;
  size?: number;
}
