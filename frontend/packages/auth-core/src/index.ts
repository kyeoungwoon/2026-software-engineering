export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const MEMBER_ID_KEY = "member_id";
export const OAUTH_VERIFICATION_TOKEN_KEY = "oauth_verification_token";
export const OAUTH_PROVIDER_KEY = "oauth_provider";
export const AUTH_SESSION_CHANGE_EVENT = "umc-auth-session-change";

export type AuthSession = {
  accessToken: string;
  memberId?: number | string;
  refreshToken: string;
};

export type OAuthProvider = "GOOGLE" | "KAKAO" | "APPLE" | "GITHUB";

export type OAuthLoginCode = "LOGIN_SUCCESS" | "REGISTER_REQUIRED";

export type OAuthLoginResponse = {
  accessToken?: string;
  code: OAuthLoginCode;
  memberId?: number | string;
  oAuthVerificationToken?: string;
  provider: OAuthProvider;
  refreshToken?: string;
  success: boolean;
};

export type OAuthRegistrationState = {
  oAuthVerificationToken: string;
  provider: OAuthProvider;
};

export type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export function readAuthSession(storage?: StorageLike): AuthSession | null {
  const accessToken = storage?.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = storage?.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    memberId: readMemberId(storage),
  };
}

export function writeAuthSession(
  session: AuthSession,
  storage?: StorageLike,
): void {
  storage?.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  storage?.setItem(REFRESH_TOKEN_KEY, session.refreshToken);

  if (session.memberId === undefined) {
    storage?.removeItem(MEMBER_ID_KEY);
  } else {
    storage?.setItem(MEMBER_ID_KEY, String(session.memberId));
  }

  dispatchAuthSessionChange();
}

export function clearAuthSession(storage?: StorageLike): void {
  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
  storage?.removeItem(MEMBER_ID_KEY);
  dispatchAuthSessionChange();
}

export function isAuthenticated(storage?: StorageLike): boolean {
  return readAuthSession(storage) !== null;
}

export function persistOAuthLoginResponse(
  response: OAuthLoginResponse,
  storage?: StorageLike,
): OAuthLoginCode {
  if (response.code === "LOGIN_SUCCESS") {
    if (!response.accessToken || !response.refreshToken) {
      throw new Error("로그인 응답에 토큰이 없습니다.");
    }

    writeAuthSession(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        memberId: response.memberId,
      },
      storage,
    );
  }

  return response.code;
}

export function readOAuthRegistrationState(
  storage?: StorageLike,
): OAuthRegistrationState | null {
  const oAuthVerificationToken = storage?.getItem(OAUTH_VERIFICATION_TOKEN_KEY);
  const provider = storage?.getItem(OAUTH_PROVIDER_KEY) as OAuthProvider | null;

  if (!oAuthVerificationToken || !provider) {
    return null;
  }

  return { oAuthVerificationToken, provider };
}

export function writeOAuthRegistrationState(
  state: OAuthRegistrationState,
  storage?: StorageLike,
): void {
  storage?.setItem(OAUTH_VERIFICATION_TOKEN_KEY, state.oAuthVerificationToken);
  storage?.setItem(OAUTH_PROVIDER_KEY, state.provider);
}

export function clearOAuthRegistrationState(storage?: StorageLike): void {
  storage?.removeItem(OAUTH_VERIFICATION_TOKEN_KEY);
  storage?.removeItem(OAUTH_PROVIDER_KEY);
}

export function getBrowserStorage(
  kind: "local" | "session",
): StorageLike | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return kind === "local" ? window.localStorage : window.sessionStorage;
}

function readMemberId(storage?: StorageLike): number | string | undefined {
  const memberIdValue = storage?.getItem(MEMBER_ID_KEY);
  if (!memberIdValue) {
    return undefined;
  }

  const numericMemberId = Number(memberIdValue);
  return Number.isFinite(numericMemberId) ? numericMemberId : memberIdValue;
}

function dispatchAuthSessionChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_CHANGE_EVENT));
  }
}
