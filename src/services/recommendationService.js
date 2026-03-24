import { get, post } from "./httpClient";

export async function generateRecommendations(userId, size = 3) {
  const response = await post(
    `/api/v1/recommendations/users/${userId}/generate`,
    { size }
  );
  return response.data.data;
}

export async function getRecommendations(userId, size = 3, refresh = false) {
  const response = await get(
    `/api/v1/recommendations/users/${userId}?size=${size}&refresh=${refresh}`
  );
  return response.data.data;
}