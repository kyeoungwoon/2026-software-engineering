import { requestApiResult } from "../../client";
import { stripEmpty } from "../shared";

import type { AxiosInstance } from "../../client";
import type {
  ActionQueueQuery,
  DashboardActionQueue,
  DashboardContext,
  DashboardOperations,
  DashboardSummary,
  OperationsQuery,
  PageResponse,
  RiskChallenger,
  RiskChallengersQuery,
  SchoolSummary,
  SchoolSummaryQuery,
  SummaryQuery,
} from "../../contracts/admin/admin-dashboard";

export function getDashboardContext(
  client: AxiosInstance,
): Promise<DashboardContext> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/dashboard/context",
  });
}

export function getDashboardSummary(
  client: AxiosInstance,
  query: SummaryQuery = {},
): Promise<DashboardSummary> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/dashboard/summary",
    params: stripEmpty(query as Record<string, unknown>),
  });
}

export function getDashboardActionQueue(
  client: AxiosInstance,
  query: ActionQueueQuery = {},
): Promise<DashboardActionQueue> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/dashboard/action-queue",
    params: stripEmpty(query as Record<string, unknown>),
  });
}

export function getDashboardOperations(
  client: AxiosInstance,
  query: OperationsQuery = {},
): Promise<DashboardOperations> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/dashboard/operations",
    params: stripEmpty(query as Record<string, unknown>),
  });
}

export function getRiskChallengers(
  client: AxiosInstance,
  query: RiskChallengersQuery = {},
): Promise<PageResponse<RiskChallenger>> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/dashboard/risk-challengers",
    params: stripEmpty(query as Record<string, unknown>),
  });
}

export function getSchoolsSummary(
  client: AxiosInstance,
  query: SchoolSummaryQuery = {},
): Promise<PageResponse<SchoolSummary>> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/schools/summary",
    params: stripEmpty(query as Record<string, unknown>),
  });
}
