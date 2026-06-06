export const TECH_BLOG_FILE_CATEGORY = "TECH_BLOG";
export const TECH_BLOG_IMAGE_CONTENT_TYPE = "image/webp";
export const TECH_BLOG_CDN_BASE_URL = "https://cdn.university.neordinary.com";

export type FileLike = {
  name: string;
  type: string;
  size: number;
};

export type PrepareUploadBody = {
  fileName: string;
  contentType: string;
  fileSize: number;
  category: typeof TECH_BLOG_FILE_CATEGORY;
};

export type PrepareUploadResult = {
  fileId: string;
  uploadUrl: string;
  uploadMethod: "PUT";
  headers: Record<string, string>;
  expiresAt: string;
};

export type UploadedTechBlogImage = {
  fileId: string;
  fileName: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
};

export type AuthenticatedUploadRequest = <T>(
  path: string,
  options: { method: string; body?: unknown },
) => Promise<T>;

export function buildPrepareUploadBody(file: FileLike): PrepareUploadBody {
  return {
    fileName: file.name,
    contentType: TECH_BLOG_IMAGE_CONTENT_TYPE,
    fileSize: file.size,
    category: TECH_BLOG_FILE_CATEGORY,
  };
}

export function buildTechBlogImageUrl(fileId: string): string {
  return `${TECH_BLOG_CDN_BASE_URL}/${encodeURIComponent(fileId)}`;
}

export function buildMarkdownImage(params: {
  fileId: string;
  alt?: string;
}): string {
  return `![${params.alt?.trim() || "image"}](${buildTechBlogImageUrl(params.fileId)})`;
}

export function resolveStorageApiUrl(apiBaseUrl: string, path: string): string {
  if (!apiBaseUrl.trim()) {
    return path;
  }

  return `${apiBaseUrl.replace(/\/+$/, "")}${path}`;
}
