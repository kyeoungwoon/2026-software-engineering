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
  NearbyTradePosts,
  SeedUser,
  TradePostDetail,
  TradePostListItem,
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

function unwrap<T>(payload: SwebookEnvelope<T> | T): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    typeof (payload as SwebookEnvelope<T>).success === "boolean"
  ) {
    const envelope = payload as SwebookEnvelope<T>;
    if (!envelope.success) {
      throw new Error(envelope.errorCode?.message || "요청에 실패했습니다.");
    }

    return (envelope.data ?? envelope.result) as T;
  }

  return payload as T;
}

async function request<T>(config: Parameters<typeof client.request>[0]): Promise<T> {
  const response = await client.request<SwebookEnvelope<T> | T>(config);
  return unwrap<T>(response.data);
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
