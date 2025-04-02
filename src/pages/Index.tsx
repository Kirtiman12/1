import { useState, useEffect } from "react";
import HeroBanner from "@/components/HeroBanner";
import GenreList from "@/components/GenreList";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";
import { fetchTrending, fetchPopular } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchTrending();
        if (data.results.length > 0) {
          // Find a movie with a backdrop for the hero banner
          const moviesWithBackdrops = data.results.filter(
            (movie) => movie.backdrop_path
          );
          if (moviesWithBackdrops.length > 0) {
            // Get a random movie from the top 5 trending movies with backdrops
            const randomIndex = Math.floor(
              Math.random() * Math.min(5, moviesWithBackdrops.length)
            );
            setFeaturedMovie(moviesWithBackdrops[randomIndex]);
          } else {
            setFeaturedMovie(data.results[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured movie:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovie();
  }, []);

  return (
    <div className={isDarkMode ? "dark" : "min-h-screen"}>
      {loading || !featuredMovie ? (
        <div className="h-[70vh] lg:h-[80vh] bg-movie-gray animate-pulse"></div>
      ) : (
        <HeroBanner movie={featuredMovie} />
      )}

      <div className="page-container -mt-6 relative z-10">
        <GenreList />

        <div className="mb-12">
          <MovieGrid fetchMovies={fetchTrending} title="Trending This Week" />
        </div>

        <div className="mb-12">
          <MovieGrid fetchMovies={fetchPopular} title="Popular Movies" />
        </div>
      </div>
    </div>
  );
};

export default Home;
