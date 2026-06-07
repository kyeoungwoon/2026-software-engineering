import { requestApiResult } from "../../client";
import { buildPrepareUploadBody } from "../../contracts/public/upload";

import type { AxiosInstance } from "../../client";
import type {
  FileLike,
  PrepareUploadResult,
} from "../../contracts/public/upload";

export function prepareTechBlogImageUpload(
  client: AxiosInstance,
  file: FileLike,
): Promise<PrepareUploadResult> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/storage/prepare-upload",
    data: buildPrepareUploadBody(file),
  });
}

export async function confirmTechBlogImageUpload(
  client: AxiosInstance,
  fileId: string,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: `/api/v1/storage/${fileId}/confirm`,
  });
}
