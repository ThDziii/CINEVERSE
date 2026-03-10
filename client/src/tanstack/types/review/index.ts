// Types cho Review feature

export interface Review {
  _id: string;
  movieId: number;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReviewsResponse {
  reviews: Review[];
  averageRating: number | null;
  count: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
  username: string;
}

export interface CreateReviewResponse {
  review: Review;
}
