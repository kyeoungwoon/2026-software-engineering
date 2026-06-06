import { requestApiResult } from "../../client";
import { stripEmpty } from "../shared";

import type { AxiosInstance } from "../../client";
import type {
  AuditLogPage,
  SearchAuditLogQuery,
} from "../../contracts/admin/audit-log";

export function searchAuditLogs(
  client: AxiosInstance,
  query: SearchAuditLogQuery,
): Promise<AuditLogPage> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/admin/audit-logs",
    params: stripEmpty(query as Record<string, unknown>),
  });
}
