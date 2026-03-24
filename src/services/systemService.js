import { get } from "./httpClient";

export async function checkBackendHealth() {
  const response = await get("/actuator/health", { useAuth: false });
  const status = response?.data?.status;

  return {
    ok: String(status || "").toUpperCase() === "UP",
    status: status || "UNKNOWN",
  };
}