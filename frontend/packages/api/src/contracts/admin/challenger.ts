export type Part =
  | "PLAN"
  | "DESIGN"
  | "WEB"
  | "ANDROID"
  | "IOS"
  | "NODEJS"
  | "SPRINGBOOT"
  | "ADMIN";

export type ChallengerStatus =
  | "ACTIVE"
  | "GRADUATED"
  | "EXPELLED"
  | "WITHDRAWN";

export type MemberStatus = "ACTIVE" | "INACTIVE" | "WITHDRAWN";

export type OrganizationType = "CENTRAL" | "CHAPTER" | "SCHOOL";

export type RoleType =
  | "CHALLENGER"
  | "SUPER_ADMIN"
  | "CENTRAL_PRESIDENT"
  | "CENTRAL_VICE_PRESIDENT"
  | "CENTRAL_OPERATING_TEAM_MEMBER"
  | "CENTRAL_EDUCATION_TEAM_MEMBER"
  | "CHAPTER_PRESIDENT"
  | "SCHOOL_PRESIDENT"
  | "SCHOOL_VICE_PRESIDENT"
  | "SCHOOL_PART_LEADER"
  | "SCHOOL_ETC_ADMIN";

export type PointType =
  | "BEST_WORKBOOK"
  | "WARNING"
  | "OUT"
  | "CUSTOM"
  | "BLOG_CHALLENGE"
  | "BEST_WORKBOOK_V2"
  | "UMC_EVENT_REVIEW"
  | "PEER_REVIEW_SUBMISSION"
  | "NO_WORKBOOK_MISSION"
  | "STUDY_LATE"
  | "STUDY_ABSENT"
  | "EVENT_LATE"
  | "EVENT_EARLY_LEAVE"
  | "EVENT_LATE_CANCEL"
  | "EVENT_NO_SHOW"
  | "PART_LEAD_FEEDBACK_LATE"
  | "SCHOOL_CORE_MEETING_ABSENT"
  | "SCHOOL_CORE_TASK_NOT_COMPLETED";

/**
 * 백엔드는 모든 ID 류 (`*Id`) 를 Java Long 정밀도 보전을 위해 numeric string 으로 직렬화한다.
 * FE 도 ID 는 string 으로 다룬다.
 */

export interface ChallengerPointInfo {
  id: string;
  challengerId: string;
  pointType: PointType;
  /** 백엔드가 number/문자열로 줄 수 있음. 호출부에서 number 변환 필요 (toNumberSafe). */
  point: number | string | null;
  description?: string | null;
  createdAt: string;
}

export interface ChallengerRoleResponse {
  challengerRoleId: string;
  challengerId: string;
  roleType: RoleType;
  organizationType: OrganizationType;
  organizationId: string;
  responsiblePart?: Part;
  gisuId: string;
  /** 표시용 기수 번호 (e.g. "9"). */
  gisu: string;
}

export interface ChallengerInfoResponse {
  challengerId: string;
  memberId: string;
  gisuId: string;
  /** 표시용 기수 번호 */
  gisu: string;
  chapterId: string;
  chapterName: string;
  part: Part;
  challengerStatus: ChallengerStatus;
  /** @deprecated `points` 사용 권장. 동일한 값. */
  challengerPoints?: ChallengerPointInfo[];
  points?: ChallengerPointInfo[];
  /** 합계 점수. 호출부에서 number 변환 필요 (toNumberSafe). */
  totalPoints?: number | string | null;
  roles?: ChallengerRoleResponse[];
  name: string;
  nickname: string;
  /** Public View 에서는 null 로 마스킹됨 */
  email: string | null;
  schoolId: string;
  schoolName: string;
  profileImageLink?: string | null;
  /** Public View 에서는 null 로 마스킹됨 */
  memberStatus?: MemberStatus | null;
  /** Public View 에서는 null 로 마스킹됨 */
  status?: MemberStatus | null;
}

export interface SearchMemberItem {
  memberId: string;
  name: string;
  nickname: string;
  email: string;
  schoolId: string;
  schoolName: string;
  profileImageLink?: string;
  challengerId?: string;
  gisuId?: string;
  gisu?: string;
  part?: Part;
  roleTypes?: RoleType[];
}

export interface SearchMemberPage {
  content: SearchMemberItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchMemberResponse {
  totalCount: number;
  page: SearchMemberPage;
}

export interface SearchMemberParams {
  page?: number;
  size?: number;
  keyword?: string;
  gisuId?: string;
  part?: Part;
  chapterId?: string;
  schoolId?: string;
}

export interface MemberRoleInfo {
  id: string;
  challengerId: string;
  roleType: RoleType;
  organizationType: OrganizationType;
  organizationId: string;
  responsiblePart?: Part;
  gisuId: string;
  gisu: string;
}

export interface MemberProfileInfo {
  id: string;
  linkedIn?: string;
  instagram?: string;
  github?: string;
  blog?: string;
  personal?: string;
}

export interface MemberInfoResponse {
  id: string;
  name: string;
  nickname: string;
  /** Public View 에서는 null 로 마스킹됨 */
  email: string | null;
  schoolId: string;
  schoolName: string;
  profileImageLink?: string | null;
  /** Public View 에서는 null 로 마스킹됨 */
  status: MemberStatus | null;
  roles?: MemberRoleInfo[];
  challengerRecords?: ChallengerInfoResponse[];
  profile?: MemberProfileInfo | null;
}

export interface GrantChallengerPointRequest {
  pointType: PointType;
  /** null 이면 pointType 의 기본 점수 사용. CUSTOM 등 자체 제도 운영 시 명시. */
  pointValue?: number | null;
  /** 부여 사유 (필수) */
  description: string;
}

export interface CreateChallengerRecordRequest {
  gisuId: string;
  chapterId: string;
  schoolId: string;
  part: Part;
  memberName: string;
  challengerRoleType: RoleType | null;
}

export interface ChallengerRecordResponse {
  code: string;
  part: Part;
  gisuId: string;
  gisu: string;
  schoolId: string;
  schoolName: string;
  chapterId: string;
  chapterName: string;
  memberName: string;
  challengerRoleType: RoleType;
  organizationId: string;
}

export interface GisuNameItem {
  gisuId: string;
  generation: string;
  gisu: string;
  isActive: boolean;
}

export interface GisuNameListResponse {
  gisuList: GisuNameItem[];
}

export interface ChapterItem {
  id: string;
  name: string;
}

export interface ChapterListResponse {
  chapters: ChapterItem[];
}

export interface SchoolItem {
  schoolId: string;
  schoolName: string;
}

export interface ChapterWithSchools {
  chapterId: string;
  chapterName: string;
  schools: SchoolItem[];
}

export interface ChapterWithSchoolsResponse {
  chapters: ChapterWithSchools[];
}

export interface SchoolNameListResponse {
  schools: SchoolItem[];
}

// Flow C — 챌린저 기록 수정/삭제

export type ChallengerDeactivationType = "WITHDRAW" | "EXPEL";

export interface DeactivateChallengerRequest {
  deactivationType: ChallengerDeactivationType;
  /** 백엔드 Long 정밀도 보전 정책에 따라 ID 는 string. */
  modifiedBy: string;
  reason: string;
}

export interface EditChallengerPartRequest {
  newPart: Part;
}

export interface EditChallengerPointRequest {
  newDescription: string;
}

// A-보조-2: Offset 기반 챌린저 검색

export interface SearchChallengerItem {
  challengerId: string;
  memberId: string;
  gisuId: string;
  /** @deprecated `gisu` 사용 권장 */
  generation: string;
  gisu: string;
  part: Part;
  name: string;
  nickname: string;
  schoolName: string;
  pointSum: number | string | null;
  profileImageLink?: string | null;
  roleTypes?: RoleType[];
}

export interface PartCount {
  part: Part;
  count: number;
}

export interface SearchChallengerOffsetResponse {
  page: {
    content: SearchChallengerItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  partCounts: PartCount[];
}

export interface SearchChallengerParams {
  keyword?: string;
  name?: string;
  nickname?: string;
  schoolId?: string;
  chapterId?: string;
  part?: Part;
  gisuId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// === Flow D — 회원 관리 페이지 (CHALLENGER-002 batch, STAFF-001 생성) ===

export interface CreateChallengerInfoRequest {
  /** 백엔드 Long 정밀도 보전 정책에 따라 ID 는 string. */
  memberId: string;
  part: Part;
  gisuId: string;
}

export interface CreateChallengerRoleRequest {
  challengerId: string;
  roleType: RoleType;
  /**
   * CENTRAL_* / SUPER_ADMIN 인 경우 omit (중앙운영사무국은 별도 organization ID 없음).
   * CHAPTER_* 인 경우 chapterId, SCHOOL_* 인 경우 schoolId.
   */
  organizationId?: string;
  /** SCHOOL_PART_LEADER 의 담당 파트. 그 외 역할은 omit. */
  responsiblePart?: Part;
  gisuId: string;
}
