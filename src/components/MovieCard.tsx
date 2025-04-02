
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';
import { getPosterUrl } from '@/lib/api';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id.toString());

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMovieFavorite) {
      removeFavorite(movie.id.toString());
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className="movie-card group">
      <Link to={`/movie/${movie.id}`} className="block relative">
        <div className="aspect-[2/3] bg-movie-gray rounded-md overflow-hidden">
          <img 
            src={getPosterUrl(movie.poster_path)} 
            alt={movie.title}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
              e.currentTarget.onerror = null;
            }}
          />
        </div>
        <div className="gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-semibold text-white truncate">{movie.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-300">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </span>
              <span className="bg-movie-red text-white text-xs px-2 py-0.5 rounded-full">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-2 right-2 rounded-full 
            ${isMovieFavorite ? 'text-movie-red bg-black/50' : 'text-white bg-black/30'} 
            hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          onClick={handleFavoriteClick}
        >
          <Heart size={18} fill={isMovieFavorite ? 'currentColor' : 'none'} />
        </Button>
      </Link>
    </div>
  );
};

export default MovieCard;
