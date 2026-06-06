import { requestApiResult } from "../../client";
import {
  buildCommentLikePath,
  buildCommentPath,
  buildCommentsPath,
  buildContentLikePath,
  DEFAULT_COMMENT_PAGE_SIZE,
  DEFAULT_COMMENT_SORT,
  normalizeComment,
  normalizeCommentPage,
} from "../../contracts/public/content";

import type { AxiosInstance } from "../../client";
import type {
  CommentListOptions,
  CommentPage,
  ContentRef,
  CreateCommentInput,
  LikeState,
  RawCommentPage,
  RawTechBlogComment,
  TechBlogComment,
  UpdateCommentInput,
} from "../../contracts/public/content";

export type PublicContentAuthOptions = {
  authenticated?: boolean;
};

export function getContentLikeState(
  client: AxiosInstance,
  ref: ContentRef,
  options: PublicContentAuthOptions = {},
): Promise<LikeState> {
  return requestApiResult(client, {
    method: "GET",
    url: buildContentLikePath(ref),
    auth: Boolean(options.authenticated),
    redirectOnAuthFailure: false,
  });
}

export function toggleContentLike(
  client: AxiosInstance,
  ref: ContentRef,
): Promise<LikeState> {
  return requestApiResult(client, {
    method: "POST",
    url: buildContentLikePath(ref),
  });
}

export async function getComments(
  client: AxiosInstance,
  ref: ContentRef,
  options: CommentListOptions & PublicContentAuthOptions = {},
): Promise<CommentPage> {
  const page = await requestApiResult<RawCommentPage | RawTechBlogComment[]>(
    client,
    {
      method: "GET",
      url: buildCommentsPath(ref, {
        cursor: options.cursor,
        size: options.size ?? DEFAULT_COMMENT_PAGE_SIZE,
        sort: options.sort ?? DEFAULT_COMMENT_SORT,
      }),
      auth: Boolean(options.authenticated),
      redirectOnAuthFailure: false,
    },
  );

  return normalizeCommentPage(page);
}

export async function getAllComments(
  client: AxiosInstance,
  ref: ContentRef,
  options: PublicContentAuthOptions = {},
): Promise<TechBlogComment[]> {
  const page = await getComments(client, ref, options);
  return page.content;
}

export async function updateComment(
  client: AxiosInstance,
  ref: ContentRef,
  commentId: number | string,
  input: UpdateCommentInput,
): Promise<TechBlogComment> {
  const comment = await requestApiResult<RawTechBlogComment>(client, {
    method: "PATCH",
    url: buildCommentPath(ref, commentId),
    data: input,
  });

  return normalizeComment(comment);
}

export async function deleteComment(
  client: AxiosInstance,
  ref: ContentRef,
  commentId: number | string,
): Promise<void> {
  await requestApiResult(client, {
    method: "DELETE",
    url: buildCommentPath(ref, commentId),
  });
}

export async function createComment(
  client: AxiosInstance,
  ref: ContentRef,
  input: CreateCommentInput,
  options: PublicContentAuthOptions = {},
): Promise<TechBlogComment> {
  const isAuthenticated = Boolean(options.authenticated);
  const comment = await requestApiResult<RawTechBlogComment>(client, {
    method: "POST",
    url: buildCommentsPath(ref),
    auth: isAuthenticated,
    redirectOnAuthFailure: false,
    data: {
      ...input,
      anonymous: isAuthenticated ? (input.anonymous ?? false) : true,
    },
  });

  return normalizeComment(comment);
}

export function toggleCommentLike(
  client: AxiosInstance,
  ref: ContentRef,
  commentId: number | string,
): Promise<LikeState> {
  return requestApiResult(client, {
    method: "POST",
    url: buildCommentLikePath(ref, commentId),
  });
}
