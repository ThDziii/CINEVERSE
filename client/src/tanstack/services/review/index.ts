/// <reference types="vite/client" />
import {
  GetReviewsResponse,
  CreateReviewPayload,
  CreateReviewResponse,
} from "../../types/review";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const { headers: extraHeaders, ...restOptions } = options;
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(extraHeaders as Record<string, string>),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Đã có lỗi xảy ra.");
  return data;
};

export const reviewService = {
  // GET /api/reviews/:movieId — public
  getByMovie: (movieId: number) =>
    request<GetReviewsResponse>(`/api/reviews/${movieId}`),

  // POST /api/reviews/:movieId — requires JWT
  create: (movieId: number, payload: CreateReviewPayload) => {
    const token = localStorage.getItem("token");
    return request<CreateReviewResponse>(`/api/reviews/${movieId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
      },
      body: JSON.stringify(payload),
    });
  },
};
