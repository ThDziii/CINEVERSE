import { useState, useCallback } from "react";

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const useAuth = () => {
  const [user, setUser] = useState(loadUser);

  // Được gọi sau khi loginMutation.onSuccess trả về data
  const login = useCallback((data) => {
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return { user, login, logout };
};

export default useAuth;
