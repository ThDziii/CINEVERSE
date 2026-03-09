import { useState, useCallback } from "react";

const useMovieModal = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const openModal  = useCallback((movie) => setSelectedMovie(movie), []);
  const closeModal = useCallback(() => setSelectedMovie(null), []);

  return { selectedMovie, openModal, closeModal };
};

export default useMovieModal;
