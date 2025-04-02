import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import { Movie, MovieResponse } from "@/types/movie";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieGridProps {
  fetchMovies: (page: number) => Promise<MovieResponse>;
  initialMovies?: Movie[];
  title?: string;
}

const MovieGrid = ({
  fetchMovies,
  initialMovies = [],
  title,
}: MovieGridProps) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // If initialMovies exist on mount and we're on page 1, don't fetch again.
    if (page === 1 && initialMovies.length > 0) return;

    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies(page);
        setMovies((prevMovies) => [
          ...prevMovies,
          ...data.results.filter(
            (movie) => !prevMovies.some((m) => m.id === movie.id)
          ),
        ]);
        setHasMore(data.page < data.total_pages);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [fetchMovies, page]); // removed initialMovies from dependencies

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      {title && <h2 className="section-title">{title}</h2>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="movie-card">
              <div className="aspect-[2/3] rounded-md overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        {hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
        {!hasMore && (
          <p className="text-gray-400 mt-2">No more movies to load</p>
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
