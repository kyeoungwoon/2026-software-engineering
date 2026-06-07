export type ContentRef = {
  type: "blog" | "release";
  slug: string;
};

export type InteractionAuthor = {
  id?: number | string;
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
};

export type CommentDeletionType = "NONE" | "USER_DELETED" | "ADMIN_DELETED";

export type TechBlogComment = {
  id: number | string;
  author?: InteractionAuthor;
  content: string;
  createdAt: string;
  likedByMe: boolean;
  likeCount: number;
  deletionType: CommentDeletionType;
  canReply: boolean;
  canEdit: boolean;
  canDelete: boolean;
  replies: TechBlogComment[];
};

export type CommentPage = {
  content: TechBlogComment[];
  nextCursor: number | null;
  hasNext: boolean;
};

export type CommentSort = "createdAt,desc" | "createdAt,asc";

export type CommentListOptions = {
  cursor?: number | string | null;
  size?: number;
  sort?: CommentSort;
};

export type CreateCommentInput = {
  content: string;
  parentCommentId?: number | string;
  anonymous?: boolean;
  nickname?: string;
};

export type UpdateCommentInput = {
  content: string;
};

export type LikeState = {
  likedByMe: boolean;
  likeCount: number;
};

export type RawTechBlogComment = Omit<Partial<TechBlogComment>, "replies"> & {
  id: number | string;
  content: string;
  createdAt: string;
  replies?: RawTechBlogComment[];
};

export type RawCommentPage = {
  content?: RawTechBlogComment[];
  nextCursor?: number | string | null;
  hasNext?: boolean;
};

export const DEFAULT_COMMENT_PAGE_SIZE = 20;
export const DEFAULT_COMMENT_SORT: CommentSort = "createdAt,desc";

export function buildContentApiPath(ref: ContentRef, suffix = ""): string {
  const type = encodeURIComponent(ref.type);
  const slug = encodeURIComponent(ref.slug);
  return `/api/v1/tech-blog/contents/${type}/${slug}${suffix}`;
}

export function buildCommentsPath(
  ref: ContentRef,
  options?: CommentListOptions,
): string {
  const path = buildContentApiPath(ref, "/comments");
  if (!options) return path;

  const params = new URLSearchParams();
  if (options.cursor !== undefined && options.cursor !== null) {
    params.set("cursor", String(options.cursor));
  }
  if (options.size !== undefined) {
    params.set("size", String(options.size));
  }
  if (options.sort) {
    params.set("sort", options.sort);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function buildContentLikePath(ref: ContentRef): string {
  return buildContentApiPath(ref, "/like");
}

export function buildCommentPath(
  ref: ContentRef,
  commentId: number | string,
): string {
  return buildContentApiPath(
    ref,
    `/comments/${encodeURIComponent(String(commentId))}`,
  );
}

export function buildCommentLikePath(
  ref: ContentRef,
  commentId: number | string,
): string {
  return `${buildCommentPath(ref, commentId)}/like`;
}

export function applyOptimisticLike(state: LikeState): LikeState {
  return state.likedByMe
    ? { likedByMe: false, likeCount: Math.max(0, state.likeCount - 1) }
    : { likedByMe: true, likeCount: state.likeCount + 1 };
}

export function normalizeCommentPage(
  page: RawCommentPage | RawTechBlogComment[] | undefined,
): CommentPage {
  if (Array.isArray(page)) {
    return {
      content: normalizeComments(page),
      nextCursor: null,
      hasNext: false,
    };
  }

  return {
    content: normalizeComments(page?.content),
    nextCursor: normalizeCursor(page?.nextCursor),
    hasNext: Boolean(page?.hasNext),
  };
}

export function normalizeComments(
  comments: RawTechBlogComment[] | undefined,
): TechBlogComment[] {
  return (comments ?? []).map(normalizeComment);
}

export function normalizeComment(comment: RawTechBlogComment): TechBlogComment {
  const deletionType = normalizeDeletionType(comment.deletionType);
  const isDeleted = deletionType !== "NONE";

  return {
    ...comment,
    likedByMe: isDeleted ? false : Boolean(comment.likedByMe),
    likeCount: isDeleted ? 0 : Math.max(0, Number(comment.likeCount) || 0),
    deletionType,
    canReply: isDeleted ? false : (comment.canReply ?? true),
    canEdit: isDeleted ? false : Boolean(comment.canEdit),
    canDelete: isDeleted ? false : Boolean(comment.canDelete),
    replies: normalizeComments(comment.replies),
  };
}

export function countComments(comments: TechBlogComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies),
    0,
  );
}

function normalizeCursor(cursor: RawCommentPage["nextCursor"]): number | null {
  if (cursor === undefined || cursor === null || cursor === "") {
    return null;
  }

  const nextCursor = Number(cursor);
  return Number.isFinite(nextCursor) ? nextCursor : null;
}

function normalizeDeletionType(deletionType: unknown): CommentDeletionType {
  if (deletionType === "USER_DELETED" || deletionType === "ADMIN_DELETED") {
    return deletionType;
  }

  return "NONE";
}
