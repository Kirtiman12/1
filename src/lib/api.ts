import { MovieDetails, MovieResponse, Genre, Movie } from '@/types/movie';

// OMDb API configuration
const OMDB_API_KEY = '9c37b6d9'; // Using the provided API key
const OMDB_BASE_URL = 'https://www.omdbapi.com';

// Helper function to handle fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.Error || 'API request failed');
  }
  return response.json();
};

// Map OMDb movie to our Movie type
const mapOMDbToMovie = (omdbMovie: any): Movie => {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    backdrop_path: null, // OMDb doesn't provide backdrop images
    overview: omdbMovie.Plot || '',
    release_date: omdbMovie.Released,
    vote_average: omdbMovie.imdbRating ? parseFloat(omdbMovie.imdbRating) : 0,
    genre_ids: [], // Will be populated with genre info when available
    popularity: 0, // Not available in OMDb
    genres: omdbMovie.Genre ? omdbMovie.Genre.split(', ').map((name: string) => ({ 
      id: name.toLowerCase().replace(/\s/g, '_'), 
      name 
    })) : [],
  };
};

// Fetch trending movies (using a fixed term instead of random selection)
export const fetchTrending = async (page = 1, existingMovies: Movie[] = []): Promise<MovieResponse> => {
  const trendingTerm = 'action'; // Fixed search term
  
  try {
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${trendingTerm}&page=${page}&type=movie`;
    const response = await fetch(url);
    const data = await handleResponse(response);

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch trending movies');
    }
    
    const newMovies = data.Search.map(mapOMDbToMovie);

    // Return the existing movies plus the new movies fetched
    return {
      page,
      results: [...existingMovies, ...newMovies],
      total_pages: Math.ceil(parseInt(data.totalResults) / 10),
      total_results: parseInt(data.totalResults),
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { page: 1, results: existingMovies, total_pages: 0, total_results: 0 };
  }
};
// Fetch movie details by ID
export const fetchMovieDetails = async (id: string): Promise<MovieDetails> => {
  try {
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to fetch movie details');
    }
    
    // Ensure we have a genres array, even if empty
    const genres = data.Genre ? 
      data.Genre.split(', ').map((name: string) => ({ 
        id: name.toLowerCase().replace(/\s/g, '_'), 
        name 
      })) : [];
    
    const movieDetails: MovieDetails = {
      ...mapOMDbToMovie(data),
      // Ensure genres is definitely present (required by MovieDetails type)
      genres,
      runtime: data.Runtime ? parseInt(data.Runtime) : 0,
      tagline: '', // Not available in OMDb
      status: '', // Not available in OMDb
      revenue: 0, // Not available in OMDb
      budget: 0, // Not available in OMDb
      production_companies: data.Production ? [{ 
        id: data.Production.toLowerCase().replace(/\s/g, '_'), 
        name: data.Production, 
        logo_path: null 
      }] : [],
    };
    
    return movieDetails;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Fetch similar movies (OMDb doesn't have similar, so i will search for same genre)
export const fetchSimilarMovies = async (id: string): Promise<MovieResponse> => {
  try {
    // First get the movie details to extract genre
    const movieDetails = await fetchMovieDetails(id);
    if (!movieDetails.genres || movieDetails.genres.length === 0) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    // Use first genre to find similar movies
    const genre = movieDetails.genres[0].name;
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${genre}&type=movie&page=1`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.Response === 'False') {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    return {
      page: 1,
      results: data.Search.filter((m: any) => m.imdbID !== id).map(mapOMDbToMovie),
      total_pages: Math.ceil(parseInt(data.totalResults) / 10),
      total_results: parseInt(data.totalResults),
    };
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Fetch genres (OMDb doesn't have genre list API, so i will create a static list)
export const fetchGenres = async (): Promise<{genres: Genre[]}> => {
  // Static list of common movie genres
  const genres: Genre[] = [
    { id: 'action', name: 'Action' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'animation', name: 'Animation' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'crime', name: 'Crime' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'drama', name: 'Drama' },
    { id: 'family', name: 'Family' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'history', name: 'History' },
    { id: 'horror', name: 'Horror' },
    { id: 'music', name: 'Music' },
    { id: 'mystery', name: 'Mystery' },
    { id: 'romance', name: 'Romance' },
    { id: 'science_fiction', name: 'Science Fiction' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'war', name: 'War' },
    { id: 'western', name: 'Western' }
  ];
  
  return { genres };
};

// Search movies
export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  try {
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.Response === 'False') {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    return {
      page,
      results: data.Search.map(mapOMDbToMovie),
      total_pages: Math.ceil(parseInt(data.totalResults) / 10),
      total_results: parseInt(data.totalResults),
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Fetch movies by genre
export const fetchMoviesByGenre = async (genreId: number | string, page = 1): Promise<MovieResponse> => {
  try {
    // Find genre name from id
    const genres = await fetchGenres();
    const genre = genres.genres.find(g => g.id === genreId);
    
    if (!genre) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    // Search by genre name
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${genre.name}&page=${page}&type=movie`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.Response === 'False') {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    return {
      page,
      results: data.Search.map(mapOMDbToMovie),
      total_pages: Math.ceil(parseInt(data.totalResults) / 10),
      total_results: parseInt(data.totalResults),
    };
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Fetch popular movies (using a consistent fixed search term)
export const fetchPopular = async (page = 1): Promise<MovieResponse> => {
  try {
    // Use a fixed search term for popular movies to ensure consistency
    const popularTerm = 'star'; // Always use 'star' for popular movies
    
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${popularTerm}&page=${page}&type=movie`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    
    if (data.Response === 'False') {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    
    return {
      page,
      results: data.Search.map(mapOMDbToMovie),
      total_pages: Math.ceil(parseInt(data.totalResults) / 10),
      total_results: parseInt(data.totalResults),
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};

// Get full backdrop URL 
export const getBackdropUrl = (path: string | null | undefined) => {
  const OMDB_BASE_URL = "https://www.omdbapi.com";
  const SIZE = "w1280"; // You can adjust this (e.g., w780, original)

  if (!path) return "/placeholder.svg"; // Fallback for null/undefined/empty
  if (path.startsWith("http")) return path; // Already a full URL
  return `${OMDB_BASE_URL}${SIZE}${path}`; // Construct TMDB URL
};
// Get poster URL
export const getPosterUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path; // Already a full URL
  return '/placeholder.svg'; // Fallback if it's not a full URL
};
