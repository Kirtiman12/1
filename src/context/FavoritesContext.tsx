
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/types/movie';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id.toString() === movie.id.toString())) {
        return prev;
      }
      toast.success(`${movie.title} added to favorites`);
      return [...prev, movie];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => {
      const movie = prev.find(m => m.id.toString() === id);
      if (movie) {
        toast.success(`${movie.title} removed from favorites`);
      }
      return prev.filter((movie) => movie.id.toString() !== id);
    });
  };

  const isFavorite = (id: string) => favorites.some((movie) => movie.id.toString() === id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
