import { requestApiResult } from "../../client";
import {
  buildDraftEndpoint,
  buildDraftPublishEndpoint,
} from "../../contracts/public/drafts";

import type { AxiosInstance } from "../../client";
import type {
  TechBlogDraftPayload,
  TechBlogDraftResponse,
} from "../../contracts/public/drafts";

export function saveTechBlogDraft(
  client: AxiosInstance,
  payload: TechBlogDraftPayload,
  draftId?: number | string,
): Promise<TechBlogDraftResponse> {
  return requestApiResult(client, {
    method: draftId ? "PATCH" : "POST",
    url: buildDraftEndpoint(draftId),
    data: payload,
  });
}

export function publishTechBlogDraft(
  client: AxiosInstance,
  draftId: number | string,
): Promise<TechBlogDraftResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: buildDraftPublishEndpoint(draftId),
  });
}
