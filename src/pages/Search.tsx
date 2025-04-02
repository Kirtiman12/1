import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "@/lib/api";
import { Movie, MovieResponse } from "@/types/movie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    setLoading(true);
    try {
      const data = await searchMovies(searchQuery, page);
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [
          ...prevMovies,
          ...data.results.filter(
            (movie) => !prevMovies.some((m) => m.id === movie.id)
          ),
        ]);
      }
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update URL when query changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
    setPage(1);
    handleSearch(debouncedQuery, 1);
  }, [debouncedQuery, setSearchParams]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(debouncedQuery, nextPage);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
          <div className="relative max-w-xl">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-movie-gray pl-10 h-12 text-white"
            />
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {!debouncedQuery && (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-400">
              Search for movies to discover
            </h2>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {debouncedQuery && !error && (
          <>
            <div className="mb-4">
              {loading && page === 1 ? (
                <h2 className="text-xl">Searching...</h2>
              ) : (
                <h2 className="text-xl">
                  {movies.length > 0
                    ? `Found ${movies.length} results for "${debouncedQuery}"`
                    : `No results found for "${debouncedQuery}"`}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}

              {loading &&
                page === 1 &&
                Array.from({ length: 10 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="movie-card">
                    <div className="aspect-[2/3] rounded-md overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </div>
                ))}
            </div>

            {loading && page > 1 && (
              <div className="text-center py-6">
                <p className="text-gray-400">Loading more results...</p>
              </div>
            )}

            {!loading && movies.length > 0 && page < totalPages && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore}>Load More</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
