export type DraftContentType = "blog" | "release";

export type TechBlogDraftPayload = {
  contentType: DraftContentType;
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
  mdx: string;
};

export type TechBlogDraftResponse = {
  id: number | string;
  status: "draft saved" | "publish queued" | "pushed" | "failed";
  message?: string;
};

export function buildDraftEndpoint(draftId?: number | string): string {
  return draftId
    ? `/api/v1/tech-blog/drafts/${encodeURIComponent(String(draftId))}`
    : "/api/v1/tech-blog/drafts";
}

export function buildDraftPublishEndpoint(draftId: number | string): string {
  return `${buildDraftEndpoint(draftId)}/publish`;
}
