import { requestApiResult } from "../../client";

import type { AxiosInstance } from "../../client";
import type {
  AppleLoginRequest,
  ChangePasswordRequest,
  CompleteEmailVerificationRequest,
  CompleteEmailVerificationResponse,
  GithubLoginRequest,
  GoogleLoginRequest,
  IdPwLoginRequest,
  IdPwLoginResponse,
  IdPwRegisterMemberRequest,
  KakaoLoginRequest,
  LoginIdAvailabilityResponse,
  OAuthLoginResponse,
  RegisterCredentialsRequest,
  RegisterMemberRequest,
  RegisterResponse,
  ResendEmailVerificationRequest,
  SchoolNameListResponse,
  SendEmailVerificationRequest,
  SendEmailVerificationResponse,
  TermResponse,
  TermType,
} from "../../contracts/admin/auth";
import type { MemberInfoResponse } from "../../contracts/admin/challenger";
import type { TokenPair } from "../../contracts/common";

export function loginWithIdPw(
  client: AxiosInstance,
  payload: IdPwLoginRequest,
): Promise<IdPwLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/login/id-pw",
    data: payload,
  });
}

export async function registerCredentials(
  client: AxiosInstance,
  payload: RegisterCredentialsRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/credentials",
    data: payload,
  });
}

export function checkLoginIdAvailability(
  client: AxiosInstance,
  loginId: string,
): Promise<LoginIdAvailabilityResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/auth/login-id/availability",
    params: { loginId },
  });
}

export async function changePassword(
  client: AxiosInstance,
  payload: ChangePasswordRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "PATCH",
    url: "/v1/auth/password",
    data: payload,
  });
}

export function sendEmailVerification(
  client: AxiosInstance,
  payload: SendEmailVerificationRequest,
): Promise<SendEmailVerificationResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/email-verification",
    data: payload,
  });
}

export async function resendEmailVerification(
  client: AxiosInstance,
  payload: ResendEmailVerificationRequest,
): Promise<void> {
  await requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/email-verification/resend",
    data: payload,
  });
}

export function completeEmailVerification(
  client: AxiosInstance,
  payload: CompleteEmailVerificationRequest,
): Promise<CompleteEmailVerificationResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/email-verification/code",
    data: payload,
  });
}

export function getMyInfo(client: AxiosInstance): Promise<MemberInfoResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/member/me",
  });
}

export function registerMemberByOAuth(
  client: AxiosInstance,
  payload: RegisterMemberRequest,
): Promise<RegisterResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/member/register/oauth",
    data: payload,
  });
}

export function registerMemberByIdPw(
  client: AxiosInstance,
  payload: IdPwRegisterMemberRequest,
): Promise<RegisterResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/member/register/id-pw",
    data: payload,
  });
}

export function getAllSchools(
  client: AxiosInstance,
): Promise<SchoolNameListResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: "/v1/schools/all",
  });
}

export function loginWithGoogle(
  client: AxiosInstance,
  payload: GoogleLoginRequest,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/login/google",
    data: payload,
  });
}

export function loginWithKakao(
  client: AxiosInstance,
  payload: KakaoLoginRequest,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/login/kakao/code",
    data: payload,
  });
}

export function loginWithGithub(
  client: AxiosInstance,
  payload: GithubLoginRequest,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/login/github",
    data: payload,
  });
}

export function loginWithApple(
  client: AxiosInstance,
  payload: Omit<AppleLoginRequest, "clientType">,
): Promise<OAuthLoginResponse> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/login/apple",
    data: { ...payload, clientType: "WEB" } satisfies AppleLoginRequest,
  });
}

export function getTermsByType(
  client: AxiosInstance,
  termType: TermType,
): Promise<TermResponse> {
  return requestApiResult(client, {
    method: "GET",
    url: `/v1/terms/type/${termType}`,
  });
}

export function renewAccessToken(
  client: AxiosInstance,
  refreshToken: string,
): Promise<TokenPair> {
  return requestApiResult(client, {
    method: "POST",
    url: "/v1/auth/token/renew",
    data: { refreshToken },
  });
}
