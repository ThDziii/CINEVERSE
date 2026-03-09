/**
 * useWatchlist — quản lý danh sách yêu thích (localStorage)
 *
 * Returns:
 *  watchlist   : Movie[]
 *  add(movie)  : thêm phim (bỏ qua nếu đã có)
 *  remove(id)  : xoá phim theo id
 *  toggle(movie): thêm nếu chưa có, xoá nếu đã có
 *  has(id)     : boolean — kiểm tra phim đã trong watchlist chưa
 *  clear()     : xoá tất cả
 */

import { useState, useCallback } from "react";

const STORAGE_KEY = "cineverse_watchlist";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const save = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(load);

  const add = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const next = [movie, ...prev];
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setWatchlist((prev) => {
      const next = prev.filter((m) => m.id !== id);
      save(next);
      return next;
    });
  }, []);

  const toggle = useCallback((movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [movie, ...prev];
      save(next);
      return next;
    });
  }, []);

  const has = useCallback(
    (id) => watchlist.some((m) => m.id === id),
    [watchlist]
  );

  const clear = useCallback(() => {
    setWatchlist([]);
    save([]);
  }, []);

  return { watchlist, add, remove, toggle, has, clear };
};

export default useWatchlist;
