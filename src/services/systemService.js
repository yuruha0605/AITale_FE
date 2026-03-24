import { buildApiUrl } from "../config/api";

export async function checkBackendHealth() {
  const response = await fetch(buildApiUrl("/actuator/health"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    ok: response.ok,
    status: response.status,
  };
}