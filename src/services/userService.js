import { buildApiUrl } from "../config/api";
import { post, request } from "./httpClient";

const USER_PREFIX = "/user-service/api/v1/users";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function persistAuth(accessToken, refreshToken) {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  const payload = decodeJwtPayload(accessToken || "");
  const userId = payload?.id || payload?.userId || payload?.sub;
  if (userId) {
    localStorage.setItem("userId", String(userId));
  }
}

export async function signUp({ email, password, age }) {
  const response = await post(`${USER_PREFIX}/signup`, {
    email,
    password,
    age: Number(age),
  }, { useAuth: false });

  return response.data;
}

export async function signIn({ email, password }) {
  const response = await post(`${USER_PREFIX}/signin`, { email, password }, { useAuth: false });

  const body = response.data || {};
  const authHeader = response.headers["authorization"] || "";
  const headerAccess = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  const accessToken = body.accessToken || headerAccess || "";
  const refreshToken = body.refreshToken || response.headers["refresh-token"] || "";

  persistAuth(accessToken, refreshToken);

  return { accessToken, refreshToken };
}

export async function updateInterests(interests) {
  const response = await request(`${USER_PREFIX}/me/interests`, {
    method: "PUT",
    body: { interests },
  });

  return response.data;
}

export function buildSocialLoginUrl(provider) {
  return buildApiUrl(`/user-service/oauth2/authorization/${provider}`);
}
