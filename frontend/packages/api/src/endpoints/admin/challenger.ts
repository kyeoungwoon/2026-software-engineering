import { requestApiResult } from "../../client";
import { toStringId } from "../shared";

import type { AxiosInstance } from "../../client";
import type {
  ChallengerInfoResponse,
  ChallengerRecordResponse,
  ChapterListResponse,
  ChapterWithSchoolsResponse,
  CreateChallengerInfoRequest,
  CreateChallengerRecordRequest,
  CreateChallengerRoleRequest,
  DeactivateChallengerRequest,
  EditChallengerPartRequest,
  EditChallengerPointRequest,
  GisuNameListResponse,
  GrantChallengerPointRequest,
  MemberInfoResponse,
  SchoolNameListResponse,
  SearchChallengerOffsetResponse,
  SearchChallengerParams,
  SearchMemberParams,
  SearchMemberResponse,
} from "../../contracts/admin/challenger";

type RawGisuItem = {
  gisuId?: string | number;
  id?: string | number;
  generation?: string | number;
  gisu?: string | number;
  isActive?: boolean;
};

type RawSchoolItem = {
  schoolId?: string | number;
  id?: string | number;
  schoolName?: string;
  name?: string;
};

type RawChapterWithSchools = {
  chapterId?: string | number;
  id?: string | number;
  chapterName?: string;
  name?: string;
  schools?: RawSchoolItem[];
};

export function getChallengerInfo(
  client: AxiosInstance,
  challengerId: string,
): Promise<ChallengerInfoResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/challenger/${encodeURIComponent(challengerId)}`,
  });
}

export function searchChallengersByOffset(
  client: AxiosInstance,
  params: SearchChallengerParams,
): Promise<SearchChallengerOffsetResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/challenger/search/offset",
    params,
  });
}

export function changeChallengerPart(
  client: AxiosInstance,
  challengerId: string,
  payload: EditChallengerPartRequest,
): Promise<ChallengerInfoResponse> {
  return requestApiResult(client, {
    method: "PATCH",
    url: `/v1/challenger/${encodeURIComponent(challengerId)}/part`,
    data: payload,
  });
}

export async function deactivateChallenger(
  client: AxiosInstance,
  challengerId: string,
  payload: DeactivateChallengerRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: `/v1/challenger/${encodeURIComponent(challengerId)}/deactivate`,
    data: payload,
  });
}

export async function deleteChallenger(
  client: AxiosInstance,
  challengerId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/challenger/${encodeURIComponent(challengerId)}`,
  });
}

export async function createChallengerBatch(
  client: AxiosInstance,
  items: CreateChallengerInfoRequest[],
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/v1/challenger/batch",
    data: items,
  });
}

export function grantChallengerPoints(
  client: AxiosInstance,
  challengerId: string,
  payload: GrantChallengerPointRequest,
): Promise<ChallengerInfoResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: `/v1/challenger/${encodeURIComponent(challengerId)}/points`,
    data: payload,
  });
}

export async function editChallengerPointDescription(
  client: AxiosInstance,
  challengerPointId: string,
  payload: EditChallengerPointRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "PATCH",
    url: `/v1/challenger/points/${encodeURIComponent(challengerPointId)}`,
    data: payload,
  });
}

export async function deleteChallengerPoint(
  client: AxiosInstance,
  challengerPointId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/challenger/points/${encodeURIComponent(challengerPointId)}`,
  });
}

export function createChallengerRecord(
  client: AxiosInstance,
  payload: CreateChallengerRecordRequest,
): Promise<ChallengerRecordResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/challenger-record",
    data: payload,
  });
}

export function getChallengerRecordByCode(
  client: AxiosInstance,
  code: string,
): Promise<ChallengerRecordResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/challenger-record/code/${encodeURIComponent(code)}`,
  });
}

export function searchMembers(
  client: AxiosInstance,
  params: SearchMemberParams,
): Promise<SearchMemberResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/member/search",
    params,
  });
}

export function getMemberProfile(
  client: AxiosInstance,
  memberId: string,
): Promise<MemberInfoResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/member/profile/${encodeURIComponent(memberId)}`,
  });
}

export async function getAllGisu(
  client: AxiosInstance,
): Promise<GisuNameListResponse> {
  const result = await requestApiResult<
    { gisuList?: RawGisuItem[] } | RawGisuItem[]
  >(client, {
    method: "GET",
    url: "/v1/gisu/all",
  });
  const raw = Array.isArray(result) ? result : (result.gisuList ?? []);

  return {
    gisuList: raw
      .map((item) => ({
        gisuId: toStringId(item.gisuId ?? item.id),
        generation: toStringId(item.generation ?? item.gisu),
        gisu: toStringId(item.gisu ?? item.generation),
        isActive: item.isActive ?? false,
      }))
      .filter((item) => item.gisuId !== ""),
  };
}

export function getAllChapters(
  client: AxiosInstance,
): Promise<ChapterListResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/chapters",
  });
}

export async function getChaptersWithSchools(
  client: AxiosInstance,
  gisuId: string,
): Promise<ChapterWithSchoolsResponse> {
  const result = await requestApiResult<
    { chapters?: RawChapterWithSchools[] } | RawChapterWithSchools[]
  >(client, {
    method: "GET",
    url: "/v1/chapters/with-schools",
    params: { gisuId },
  });
  const raw = Array.isArray(result) ? result : (result.chapters ?? []);

  return {
    chapters: raw
      .map((chapter) => ({
        chapterId: toStringId(chapter.chapterId ?? chapter.id),
        chapterName: chapter.chapterName ?? chapter.name ?? "",
        schools: (chapter.schools ?? [])
          .map((school) => ({
            schoolId: toStringId(school.schoolId ?? school.id),
            schoolName: school.schoolName ?? school.name ?? "",
          }))
          .filter((school) => school.schoolId !== ""),
      }))
      .filter((chapter) => chapter.chapterId !== ""),
  };
}

export function getAllSchools(
  client: AxiosInstance,
): Promise<SchoolNameListResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/schools/all",
  });
}

export async function createChallengerRole(
  client: AxiosInstance,
  payload: CreateChallengerRoleRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/v1/authorization/challenger-role",
    data: payload,
  });
}

export async function deleteChallengerRole(
  client: AxiosInstance,
  challengerRoleId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/authorization/challenger-role/${encodeURIComponent(challengerRoleId)}`,
  });
}

export async function deleteMember(
  client: AxiosInstance,
  memberId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/member/${encodeURIComponent(memberId)}`,
  });
}
