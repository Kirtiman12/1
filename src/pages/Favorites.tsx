
import { useFavorites } from '@/context/FavoritesContext';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="text-movie-red mb-4" size={48} strokeWidth={1.5} />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Start adding your favorite movies to build your collection.
            </p>
            <Button asChild>
              <Link to="/">Browse Movies</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
