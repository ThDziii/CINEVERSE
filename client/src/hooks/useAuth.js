import { useState, useCallback } from "react";

const STORAGE_KEY = "cineverse_user";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

const useAuth = () => {
  const [user, setUser] = useState(loadUser);

  // Giả lập login — trong thực tế sẽ gọi API
  const login = useCallback(({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error("Vui lòng nhập đầy đủ thông tin."));
          return;
        }
        if (password.length < 6) {
          reject(new Error("Mật khẩu phải có ít nhất 6 ký tự."));
          return;
        }
        const newUser = {
          email,
          name: email.split("@")[0],
          avatar: null,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
        resolve(newUser);
      }, 800);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
};

export default useAuth;
