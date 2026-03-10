import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authService } from "../../services/auth";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "../../types/auth";


//Register
export const useRegister = () =>
  useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (data) => {
      toast.success(data.msg || "Đăng ký thành công! Vui lòng đăng nhập.");
    },
    onError: (error) => {
      toast.error(error.message || "Đăng ký thất bại.");
    },
  });

//Login
export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Chào mừng, ${data.user.username}! 🎬`);
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập thất bại.");
    },
  });

//Logout
export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  return { logout };
};