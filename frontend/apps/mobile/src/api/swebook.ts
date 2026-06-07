import { createAxiosApiClient } from "@umc/api/client";

import type {
  AvailableTimeResponse,
  Book,
  Category,
  CreateBookInput,
  CreateTradePostInput,
  CreateTradePostResponse,
  CreateTradeRequestResponse,
  LocationPreset,
  MeTradeRequest,
  NearbyTradePosts,
  SeedUser,
  TradePostDetail,
  TradePostListItem,
  TradeRequestActionResponse,
} from "./types";

type SwebookEnvelope<T> = {
  success: boolean;
  successCode?: {
    httpStatus: string;
    code: string;
    message: string;
  };
  errorCode?: {
    httpStatus: string;
    code: string;
    message: string;
  };
  data?: T;
  result?: T;
};

const DEFAULT_API_BASE_URL = "http://localhost:8080";

const client = createAxiosApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  timeout: 12_000,
});

function stripEmpty<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  ) as Partial<T>;
}

export class SwebookApiError extends Error {
  code?: string;
  httpStatus?: string;

  constructor(message: string, options: { code?: string; httpStatus?: string } = {}) {
    super(formatErrorMessage(message, options));
    this.name = "SwebookApiError";
    this.code = options.code;
    this.httpStatus = options.httpStatus;
  }
}

function formatErrorMessage(
  message: string,
  options: { code?: string; httpStatus?: string },
): string {
  const details = [options.code, options.httpStatus].filter(Boolean).join(" · ");
  return details ? `${message} (${details})` : message;
}

function unwrap<T>(payload: SwebookEnvelope<T> | T): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    typeof (payload as SwebookEnvelope<T>).success === "boolean"
  ) {
    const envelope = payload as SwebookEnvelope<T>;
    if (!envelope.success) {
      throw new SwebookApiError(envelope.errorCode?.message || "요청에 실패했습니다.", {
        code: envelope.errorCode?.code,
        httpStatus: envelope.errorCode?.httpStatus,
      });
    }

    return (envelope.data ?? envelope.result) as T;
  }

  return payload as T;
}

async function request<T>(config: Parameters<typeof client.request>[0]): Promise<T> {
  try {
    const response = await client.request<SwebookEnvelope<T> | T>(config);
    return unwrap<T>(response.data);
  } catch (error) {
    throw toSwebookApiError(error);
  }
}

function toSwebookApiError(error: unknown): Error {
  if (error instanceof SwebookApiError) {
    return error;
  }

  if (error && typeof error === "object" && "response" in error) {
    const response = (error as {
      response?: {
        data?: SwebookEnvelope<unknown>;
        status?: number;
        statusText?: string;
      };
    }).response;
    const data = response?.data;
    const errorCode = data && typeof data === "object" ? data.errorCode : undefined;

    if (errorCode) {
      return new SwebookApiError(errorCode.message || "요청에 실패했습니다.", {
        code: errorCode.code,
        httpStatus: errorCode.httpStatus,
      });
    }

    if (response?.status) {
      return new SwebookApiError("서버 요청에 실패했습니다.", {
        httpStatus: `${response.status} ${response.statusText ?? ""}`.trim(),
      });
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("요청에 실패했습니다.");
}

export function getTradePosts(): Promise<TradePostListItem[]> {
  return request<TradePostListItem[]>({
    method: "GET",
    url: "/api/trade-posts",
  });
}

export function searchNearbyTradePosts(params: {
  latitude: number;
  longitude: number;
  categoryCode: string;
  bookTitle?: string;
  page?: number;
  size?: number;
}): Promise<NearbyTradePosts> {
  return request<NearbyTradePosts>({
    method: "GET",
    url: "/api/trade-posts/search",
    params: {
      page: 0,
      size: 20,
      ...params,
    },
  });
}

export function getTradePost(postId: number): Promise<TradePostDetail> {
  return request<TradePostDetail>({
    method: "GET",
    url: `/api/trade-posts/${postId}`,
  });
}

export function getAvailableTimes(postId: number): Promise<AvailableTimeResponse> {
  return request<AvailableTimeResponse>({
    method: "GET",
    url: `/api/trade-posts/${postId}/available-times`,
  });
}

export function getMajors(): Promise<Category[]> {
  return request<Category[]>({
    method: "GET",
    url: "/api/categories/majors",
  });
}

export function getCourses(majorCode: string): Promise<Category[]> {
  return request<Category[]>({
    method: "GET",
    url: `/api/categories/${majorCode}/courses`,
  });
}

export function getLocations(): Promise<LocationPreset[]> {
  return request<LocationPreset[]>({
    method: "GET",
    url: "/api/locations",
  });
}

export function getUsers(): Promise<SeedUser[]> {
  return request<SeedUser[]>({
    method: "GET",
    url: "/api/users",
  });
}

export function searchBooks(keyword: string): Promise<Book[]> {
  return request<Book[]>({
    method: "GET",
    url: "/api/books/search",
    params: { keyword },
  });
}

export function createBook(input: CreateBookInput): Promise<Book> {
  return request<Book>({
    method: "POST",
    url: "/api/books",
    data: stripEmpty(input),
  });
}

export function createTradePost(input: CreateTradePostInput): Promise<CreateTradePostResponse> {
  return request<CreateTradePostResponse>({
    method: "POST",
    url: "/api/trade-posts",
    data: stripEmpty(input),
  });
}

export function uploadTradePostImages(postId: number, files: File[]): Promise<unknown> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  return request({
    method: "POST",
    url: `/api/trade-posts/${postId}/images`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function createTradeRequest(params: {
  postId: number;
  userId: number;
  availableTime: string;
}): Promise<CreateTradeRequestResponse> {
  return request<CreateTradeRequestResponse>({
    method: "POST",
    url: `/api/trade-posts/${params.postId}/requests`,
    data: {
      userId: params.userId,
      availableTime: params.availableTime,
    },
  });
}

export function getMyTradeRequests(userId: number): Promise<MeTradeRequest[]> {
  return request<MeTradeRequest[]>({
    method: "GET",
    url: `/api/me/trade-requests/${userId}`,
  });
}

export function getMySales(userId: number): Promise<TradePostListItem[]> {
  return request<TradePostListItem[]>({
    method: "GET",
    url: `/api/me/sales/${userId}`,
  });
}

export function getSalesRequests(userId: number): Promise<MeTradeRequest[]> {
  return request<MeTradeRequest[]>({
    method: "GET",
    url: `/api/me/sales/requests/${userId}`,
  });
}

export function acceptTradeRequest(requestId: number): Promise<TradeRequestActionResponse> {
  return request<TradeRequestActionResponse>({
    method: "PATCH",
    url: `/api/trade-requests/${requestId}/accept`,
  });
}

export function rejectTradeRequest(requestId: number): Promise<TradeRequestActionResponse> {
  return request<TradeRequestActionResponse>({
    method: "PATCH",
    url: `/api/trade-requests/${requestId}/reject`,
  });
}
