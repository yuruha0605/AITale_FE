import { API_TIMEOUT_MS, buildApiUrl } from "../config/api";

function toHeadersObject(headers) {
  const result = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

function parseResponseBody(response, text) {
  if (!text) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function handleUnauthorized() {
  // 토큰 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  
  // 로그인 페이지로 리다이렉트
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || API_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = localStorage.getItem("accessToken");
    const headers = {
      ...(options.headers || {}),
    };

    if (!headers["Content-Type"] && options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (options.useAuth !== false && token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(buildApiUrl(path), {
      method: options.method || "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      credentials: options.credentials || "omit",
    });

    const rawText = await response.text();
    const data = parseResponseBody(response, rawText);

    if (!response.ok) {
      // 401 Unauthorized 처리
      if (response.status === 401) {
        handleUnauthorized();
      }

      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return {
      status: response.status,
      data,
      headers: toHeadersObject(response.headers),
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function get(path, options = {}) {
  return request(path, { ...options, method: "GET" });
}

export function post(path, body, options = {}) {
  return request(path, { ...options, method: "POST", body });
}