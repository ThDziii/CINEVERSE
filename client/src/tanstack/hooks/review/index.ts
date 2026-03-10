import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewService } from "../../services/review";
import { CreateReviewPayload } from "../../types/review";

// ── Query key factory ──
export const reviewKeys = {
  all:     () => ["reviews"] as const,
  byMovie: (movieId: number) => ["reviews", movieId] as const,
};

// ── GET reviews cho một bộ phim ──
export const useReviews = (movieId: number) =>
  useQuery({
    queryKey: reviewKeys.byMovie(movieId),
    queryFn:  () => reviewService.getByMovie(movieId),
    enabled:  !!movieId,
    staleTime: 1000 * 60, // cache 1 phút
  });

// ── POST tạo review mới ──
export const useCreateReview = (movieId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.create(movieId, payload),

    onSuccess: () => {
      toast.success("Đánh giá của bạn đã được gửi thành công!");
      // Invalidate để fetch lại danh sách reviews mới nhất
      queryClient.invalidateQueries({ queryKey: reviewKeys.byMovie(movieId) });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Có lỗi xảy ra khi gửi đánh giá.");
    },
  });
};
