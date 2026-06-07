import { requestApiResult } from "../../client";

import type { AxiosInstance } from "../../client";
import type { TokenPair } from "../../contracts/common";
import type {
  AuthMember,
  CompleteEmailVerificationResponse,
  EmailLoginRequest,
  EmailLoginResponse,
  IdPwRegisterMemberRequest,
  LoginIdAvailabilityResponse,
  OAuthLoginResponse,
  OAuthRegisterMemberRequest,
  RegisterResponse,
  SchoolNameListResponse,
  SendEmailVerificationResponse,
  TermResponse,
  TermType,
} from "../../contracts/public/auth";

export function renewAuthTokens(
  client: AxiosInstance,
  refreshToken: string,
): Promise<TokenPair> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/token/renew",
    auth: false,
    retryOnUnauthorized: false,
    redirectOnAuthFailure: false,
    data: { refreshToken },
  });
}

export function loginWithEmail(
  client: AxiosInstance,
  payload: EmailLoginRequest,
): Promise<EmailLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/login/email",
    auth: false,
    data: { ...payload, clientType: payload.clientType ?? "WEB" },
  });
}

export function loginWithGoogle(
  client: AxiosInstance,
  accessToken: string,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/login/google",
    auth: false,
    data: { accessToken },
  });
}

export function loginWithKakaoCode(
  client: AxiosInstance,
  params: { authorizationCode: string; redirectUri: string },
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/login/kakao/code",
    auth: false,
    data: params,
  });
}

export function loginWithApple(
  client: AxiosInstance,
  authorizationCode: string,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/login/apple",
    auth: false,
    data: { authorizationCode, clientType: "WEB" },
  });
}

export function getCurrentMember(client: AxiosInstance): Promise<AuthMember> {
  return requestApiResult(client, {
    method: "GET",
    url: "/api/v1/member/me",
  });
}

export function sendEmailVerification(
  client: AxiosInstance,
  email: string,
): Promise<SendEmailVerificationResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/email-verification",
    auth: false,
    data: { email, purpose: "REGISTER" },
  });
}

export async function resendEmailVerification(
  client: AxiosInstance,
  emailVerificationId: number,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/email-verification/resend",
    auth: false,
    data: { emailVerificationId },
  });
}

export function completeEmailVerification(
  client: AxiosInstance,
  params: { emailVerificationId: number; verificationCode: string },
): Promise<CompleteEmailVerificationResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/auth/email-verification/code",
    auth: false,
    data: params,
  });
}

export function checkLoginIdAvailability(
  client: AxiosInstance,
  loginId: string,
): Promise<LoginIdAvailabilityResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/api/v1/auth/login-id/availability?loginId=${encodeURIComponent(loginId)}`,
    auth: false,
    redirectOnAuthFailure: false,
  });
}

export function getAllSchools(
  client: AxiosInstance,
): Promise<SchoolNameListResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/api/v1/schools/all",
    auth: false,
    redirectOnAuthFailure: false,
  });
}

export function getTermsByType(
  client: AxiosInstance,
  termType: TermType,
): Promise<TermResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/api/v1/terms/type/${termType}`,
    auth: false,
    redirectOnAuthFailure: false,
  });
}

export function registerMemberByIdPw(
  client: AxiosInstance,
  payload: IdPwRegisterMemberRequest,
): Promise<RegisterResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/member/register/id-pw",
    auth: false,
    data: payload,
  });
}

export function registerMemberByOAuth(
  client: AxiosInstance,
  payload: OAuthRegisterMemberRequest,
): Promise<RegisterResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/api/v1/member/register/oauth",
    auth: false,
    data: payload,
  });
}
