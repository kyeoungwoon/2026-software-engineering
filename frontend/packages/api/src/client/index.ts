import axios, {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiResponse, TokenPair } from "../contracts";

export { AxiosError };
export type {
  ApiResponse,
  AxiosAdapter,
  AxiosInstance,
  AxiosResponse,
  TokenPair,
};

export class ApiClientError extends Error {
  code?: string;
  status: number;

  constructor(message: string, options: { status: number; code?: string }) {
    super(message);
    this.name = "ApiClientError";
    this.status = options.status;
    this.code = options.code;
  }
}

export type AuthFailureReason = "auth-code" | "refresh-failed" | "unauthorized";

export type AuthenticatedAxiosRequestConfig<Data = unknown> = Omit<
  AxiosRequestConfig<Data>,
  "auth"
> & {
  auth?: boolean;
  redirectOnAuthFailure?: boolean;
  retryOnUnauthorized?: boolean;
};

type ApiAxiosRequestConfig = AxiosRequestConfig & {
  _umcAuth?: boolean;
  _umcRedirectOnAuthFailure?: boolean;
  _umcRetryAttempted?: boolean;
  _umcRetryOnUnauthorized?: boolean;
};

type InternalApiAxiosRequestConfig = InternalAxiosRequestConfig & {
  _umcAuth?: boolean;
  _umcRedirectOnAuthFailure?: boolean;
  _umcRetryAttempted?: boolean;
  _umcRetryOnUnauthorized?: boolean;
};

export type AxiosApiClientOptions = {
  apiPrefix?: string;
  adapter?: AxiosAdapter;
  baseURL?: string;
  clearSession?: () => void;
  getAccessToken?: () => string | null | undefined;
  getRefreshToken?: () => string | null | undefined;
  headers?: Record<string, string>;
  isAuthErrorCode?: (code: string) => boolean;
  onAuthFailure?: (reason: AuthFailureReason) => void;
  renewPath?: string;
  setTokens?: (tokens: TokenPair) => void;
  timeout?: number;
};

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RENEW_PATH = "/v1/auth/token/renew";

export function createAxiosApiClient(
  options: AxiosApiClientOptions = {},
): AxiosInstance {
  const instance = axios.create({
    adapter: options.adapter,
    baseURL: options.baseURL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  let refreshInFlight: Promise<TokenPair | null> | null = null;

  instance.interceptors.request.use((config) => {
    config.url = resolveApiPath(config.url ?? "", options.apiPrefix);

    if ((config as InternalApiAxiosRequestConfig)._umcAuth === false) {
      return config;
    }

    const accessToken = options.getAccessToken?.();
    if (accessToken) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (isAuthErrorResponse(response, options.isAuthErrorCode)) {
        handleAuthFailure(options, "auth-code");
        return Promise.reject(toApiClientErrorFromResponse(response));
      }

      return response;
    },
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as ApiAxiosRequestConfig | undefined;

      if (
        originalRequest?._umcAuth !== false &&
        isAuthErrorData(error.response?.data, options.isAuthErrorCode)
      ) {
        handleAuthFailure(options, "auth-code");
        return Promise.reject(error);
      }

      if (!shouldRetryUnauthorized(error, originalRequest)) {
        return Promise.reject(error);
      }

      const refreshToken = options.getRefreshToken?.();
      if (!refreshToken || !originalRequest) {
        handleAuthFailure(options, "unauthorized", originalRequest);
        return Promise.reject(error);
      }

      originalRequest._umcRetryAttempted = true;

      try {
        refreshInFlight ??= renewTokens(refreshToken, options).finally(() => {
          refreshInFlight = null;
        });

        const tokens = await refreshInFlight;
        if (!tokens) {
          handleAuthFailure(options, "refresh-failed", originalRequest);
          return Promise.reject(error);
        }

        options.setTokens?.(tokens);
        originalRequest.headers = AxiosHeaders.from(
          originalRequest.headers as AxiosHeaders | undefined,
        );
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${tokens.accessToken}`,
        );
        return instance(originalRequest);
      } catch (refreshError) {
        handleAuthFailure(options, "refresh-failed", originalRequest);
        return Promise.reject(refreshError);
      }
    },
  );

  return instance;
}

export const createApiClient = createAxiosApiClient;

export async function requestApiResult<T>(
  client: AxiosInstance,
  config: AuthenticatedAxiosRequestConfig,
): Promise<T> {
  const response = await client.request<ApiResponse<T> | T>(
    toAxiosRequestConfig(config),
  );
  return unwrapApiResponse(response);
}

export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T> | T>,
): T {
  const data = response.data;
  if (isApiResponse<T>(data)) {
    if (!data.success) {
      throw new ApiClientError(data.message || "요청에 실패했습니다.", {
        status: response.status,
        code: data.code,
      });
    }

    return data.result;
  }

  return data as T;
}

export function resolveApiPath(path: string, apiPrefix?: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedPrefix = normalizePathPrefix(apiPrefix);
  return `${normalizedPrefix}${normalizedPath}`;
}

export function hasApiAuthErrorCode(
  data: unknown,
  predicate = defaultAuthErrorPredicate,
): boolean {
  if (!data || typeof data !== "object") return false;
  const code = (data as { code?: unknown }).code;
  return typeof code === "string" && predicate(code);
}

export function normalizeApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    if (isApiResponse<unknown>(data)) {
      return new ApiClientError(
        data.message || `요청에 실패했습니다. (${status})`,
        {
          status,
          code: data.code,
        },
      );
    }

    if (typeof data === "string" && data.trim()) {
      return new ApiClientError(data, { status });
    }

    return new ApiClientError(
      error.message || `요청에 실패했습니다. (${status})`,
      { status },
    );
  }

  return new ApiClientError(
    error instanceof Error ? error.message : "요청에 실패했습니다.",
    { status: 0 },
  );
}

function shouldRetryUnauthorized(
  error: AxiosError,
  originalRequest: ApiAxiosRequestConfig | undefined,
): boolean {
  return Boolean(
    originalRequest &&
    error.response?.status === 401 &&
    originalRequest._umcRetryAttempted !== true &&
    originalRequest._umcAuth !== false &&
    originalRequest._umcRetryOnUnauthorized !== false,
  );
}

async function renewTokens(
  refreshToken: string,
  options: AxiosApiClientOptions,
): Promise<TokenPair | null> {
  const response = await axios.post<ApiResponse<TokenPair>>(
    resolveApiPath(options.renewPath ?? DEFAULT_RENEW_PATH, options.apiPrefix),
    { refreshToken },
    {
      adapter: options.adapter,
      baseURL: options.baseURL,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    },
  );

  const data = response.data;
  if (!data.success) {
    return null;
  }

  return data.result;
}

function handleAuthFailure(
  options: AxiosApiClientOptions,
  reason: AuthFailureReason,
  config?: ApiAxiosRequestConfig,
): void {
  options.clearSession?.();

  if (config?._umcRedirectOnAuthFailure !== false) {
    options.onAuthFailure?.(reason);
  }
}

function isAuthErrorResponse(
  response: AxiosResponse,
  predicate = defaultAuthErrorPredicate,
): boolean {
  const config = response.config as InternalApiAxiosRequestConfig;
  return (
    config._umcAuth !== false && hasApiAuthErrorCode(response.data, predicate)
  );
}

function toAxiosRequestConfig(
  config: AuthenticatedAxiosRequestConfig,
): AxiosRequestConfig {
  const { auth, redirectOnAuthFailure, retryOnUnauthorized, ...axiosConfig } =
    config;
  return {
    ...axiosConfig,
    _umcAuth: auth,
    _umcRedirectOnAuthFailure: redirectOnAuthFailure,
    _umcRetryOnUnauthorized: retryOnUnauthorized,
  } as ApiAxiosRequestConfig;
}

function isAuthErrorData(
  data: unknown,
  predicate = defaultAuthErrorPredicate,
): boolean {
  return hasApiAuthErrorCode(data, predicate);
}

function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
  return (
    data !== null &&
    typeof data === "object" &&
    "success" in data &&
    "result" in data
  );
}

function toApiClientErrorFromResponse(response: AxiosResponse): ApiClientError {
  const data = response.data;
  if (data && typeof data === "object") {
    const body = data as { code?: unknown; message?: unknown };
    return new ApiClientError(
      typeof body.message === "string" ? body.message : response.statusText,
      {
        status: response.status,
        code: typeof body.code === "string" ? body.code : undefined,
      },
    );
  }

  return new ApiClientError(response.statusText, { status: response.status });
}

function normalizePathPrefix(prefix?: string): string {
  if (!prefix?.trim()) {
    return "";
  }

  const normalized = prefix.startsWith("/") ? prefix : `/${prefix}`;
  return normalized.replace(/\/+$/, "");
}

function defaultAuthErrorPredicate(code: string): boolean {
  return code.startsWith("JWT");
}
