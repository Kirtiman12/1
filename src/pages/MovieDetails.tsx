import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, fetchSimilarMovies, getBackdropUrl, getPosterUrl } from '@/lib/api';
import { MovieDetails, Movie } from '@/types/movie';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Star, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MovieCard from '@/components/MovieCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const movieData = await fetchMovieDetails(id);
        setMovie(movieData);
        
        const similarData = await fetchSimilarMovies(id);
        setSimilarMovies(similarData.results);
      } catch (err) {
        console.error('Failed to fetch movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const isMovieFavorite = movie ? isFavorite(movie.id.toString()) : false;

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isMovieFavorite) {
      removeFavorite(movie.id.toString());
    } else {
      addFavorite(movie);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="page-container">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          
          <div className="h-[50vh] w-full rounded-xl bg-movie-gray animate-pulse mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <Skeleton className="h-[450px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-2/4" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Movie</h2>
          <p className="text-gray-400 mb-6">{error || 'Movie not found'}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0 h-[50vh] overflow-hidden z-0">
            <img
              src={getBackdropUrl(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-movie-dark via-movie-dark/90 to-movie-dark/60"></div>
          </div>
        )}
        
        <div className="page-container relative z-10 pt-4">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4 text-white">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mt-8">
            <div className="mx-auto md:mx-0 w-full max-w-[300px]">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={getPosterUrl(movie.poster_path)} 
                  alt={movie.title} 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <Button 
                className={`w-full mt-4 ${
                  isMovieFavorite ? 'bg-movie-gray text-white' : 'bg-movie-red hover:bg-red-700'
                }`}
                onClick={handleFavoriteToggle}
              >
                <Heart className="mr-2" fill={isMovieFavorite ? 'currentColor' : 'none'} />
                {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="text-movie-red mr-1" size={18} />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                
                {movie.runtime > 0 && (
                  <div className="flex items-center">
                    <Clock className="text-movie-red mr-1" size={18} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                {movie.release_date && (
                  <span className="text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-300">{movie.overview || 'No overview available'}</p>
              </div>
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span 
                        key={genre.id} 
                        className="bg-movie-gray px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Production</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-300">
                    {movie.production_companies.map((company) => (
                      <span key={company.id}>{company.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {similarMovies.length > 0 && (
            <div className="mt-16 mb-12">
              <h2 className="section-title">Similar Movies</h2>
              <ScrollArea className="w-full">
                <div className="flex space-x-4 pb-4">
                  {similarMovies.map((movie) => (
                    <div key={movie.id} className="w-[180px] flex-none">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
