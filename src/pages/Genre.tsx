
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMoviesByGenre, fetchGenres } from '@/lib/api';
import MovieGrid from '@/components/MovieGrid';
import { Genre } from '@/types/movie';

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();
  const [genreName, setGenreName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenreName = async () => {
      try {
        const data = await fetchGenres();
        const genre = data.genres.find(g => g.id === parseInt(id || '0'));
        if (genre) {
          setGenreName(genre.name);
        }
      } catch (error) {
        console.error('Failed to fetch genre name:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenreName();
  }, [id]);

  const fetchMoviesForGenre = async (page: number) => {
    return await fetchMoviesByGenre(parseInt(id || '0'), page);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-container">
        <h1 className="text-3xl font-bold mb-8">
          {loading ? 'Loading...' : genreName ? `${genreName} Movies` : 'Genre Movies'}
        </h1>
        
        <MovieGrid fetchMovies={fetchMoviesForGenre} />
      </div>
    </div>
  );
};

export default GenrePage;
