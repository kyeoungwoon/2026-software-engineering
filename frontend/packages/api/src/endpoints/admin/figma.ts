import { requestApiResult } from "../../client";

import type { AxiosInstance } from "../../client";
import type {
  AddMentionRequest,
  AddMentionResponse,
  CreateRoutingDomainRequest,
  CreateRoutingDomainResponse,
  CreateWatchedFileRequest,
  CreateWatchedFileResponse,
  DigestParams,
  FigmaDigestSummary,
  FigmaSummaryResult,
  ListWatchedFilesParams,
  OAuthAuthorizeUrlResponse,
  PreviewParams,
  RoutingDomainDetail,
  RoutingDomainListItem,
  RoutingDomainMention,
  UpdateMentionRequest,
  UpdateRoutingDomainRequest,
  WatchedFile,
} from "../../contracts/admin/figma";

export function getFigmaOAuthAuthorizeUrl(
  client: AxiosInstance,
): Promise<OAuthAuthorizeUrlResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/figma/oauth",
  });
}

export function listRoutingDomains(
  client: AxiosInstance,
): Promise<RoutingDomainListItem[]> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/figma/routing-domains",
  });
}

export function getRoutingDomain(
  client: AxiosInstance,
  domainId: string,
): Promise<RoutingDomainDetail> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/admin/figma/routing-domains/${domainId}`,
  });
}

export function listMentions(
  client: AxiosInstance,
  domainId: string,
): Promise<RoutingDomainMention[]> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/admin/figma/routing-domains/${domainId}/mentions`,
  });
}

export function createRoutingDomain(
  client: AxiosInstance,
  payload: CreateRoutingDomainRequest,
): Promise<CreateRoutingDomainResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/admin/figma/routing-domains",
    data: payload,
  });
}

export async function updateRoutingDomain(
  client: AxiosInstance,
  domainId: string,
  payload: UpdateRoutingDomainRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "PATCH",
    url: `/v1/admin/figma/routing-domains/${domainId}`,
    data: payload,
  });
}

export async function deleteRoutingDomain(
  client: AxiosInstance,
  domainId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/admin/figma/routing-domains/${domainId}`,
  });
}

export function addMention(
  client: AxiosInstance,
  domainId: string,
  payload: AddMentionRequest,
): Promise<AddMentionResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: `/v1/admin/figma/routing-domains/${domainId}/mentions`,
    data: payload,
  });
}

export async function updateMention(
  client: AxiosInstance,
  mentionId: string,
  payload: UpdateMentionRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "PATCH",
    url: `/v1/admin/figma/routing-domains/mentions/${mentionId}`,
    data: payload,
  });
}

export async function deleteMention(
  client: AxiosInstance,
  mentionId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/admin/figma/routing-domains/mentions/${mentionId}`,
  });
}

export async function runFigmaSync(client: AxiosInstance): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/v1/admin/figma/sync",
  });
}

export async function runFigmaSyncForFile(
  client: AxiosInstance,
  watchedFileId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: `/v1/admin/figma/sync/watched-files/${watchedFileId}`,
  });
}

export function runFigmaDigest(
  client: AxiosInstance,
  params: DigestParams,
): Promise<FigmaDigestSummary> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/admin/figma/digest",
    params,
  });
}

export function getFigmaPreview(
  client: AxiosInstance,
  params: PreviewParams = {},
): Promise<FigmaSummaryResult> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/figma/preview",
    params,
  });
}

export function listWatchedFiles(
  client: AxiosInstance,
  params: ListWatchedFilesParams = {},
): Promise<WatchedFile[]> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/figma/watched-files",
    params,
  });
}

export function getWatchedFile(
  client: AxiosInstance,
  watchedFileId: string,
): Promise<WatchedFile> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/admin/figma/watched-files/${watchedFileId}`,
  });
}

export function createWatchedFile(
  client: AxiosInstance,
  payload: CreateWatchedFileRequest,
): Promise<CreateWatchedFileResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/admin/figma/watched-files",
    data: payload,
  });
}

export async function disableWatchedFile(
  client: AxiosInstance,
  watchedFileId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: `/v1/admin/figma/watched-files/${watchedFileId}`,
  });
}

export async function enableWatchedFile(
  client: AxiosInstance,
  watchedFileId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: `/v1/admin/figma/watched-files/${watchedFileId}/enable`,
  });
}
