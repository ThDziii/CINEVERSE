/// <reference types="vite/client" />
import {
  RegisterResponse,
  RegisterPayload,
  LoginPayload,
  LoginResponse,
} from "../../types/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || data.error || "Đã có lỗi xảy ra.");
  return data;
};

export const authService = {
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
