import { useState, useCallback } from "react";

const STORAGE_KEY = "cineverse_search_history";
const MAX_HISTORY = 10;

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const save = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const useSearchHistory = () => {
  const [history, setHistory] = useState(load);

  const addHistory = useCallback((movie) => {
    setHistory((prev) => {
      // Không thêm trùng
      const filtered = prev.filter((m) => m.id !== movie.id);
      const next = [movie, ...filtered].slice(0, MAX_HISTORY);
      save(next);
      return next;
    });
  }, []);

  const removeHistory = useCallback((id) => {
    setHistory((prev) => {
      const next = prev.filter((m) => m.id !== id);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addHistory, removeHistory, clearHistory };
};

export default useSearchHistory;
