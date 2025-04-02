
export interface Movie {
  id: number | string;
  title: string;
  poster_path?: string;
  poster?: string; // Alternative field name for poster
  backdrop_path?: string;
  backdrop?: string; // Alternative field name for backdrop
  overview: string;
  release_date?: string;
  vote_average?: number;
  rating?: number; // Alternative field name for rating
  genre_ids?: (number | string)[];
  genres?: Genre[];
  popularity?: number;
  // Add any other fields that might be common across movie APIs
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  revenue?: number;
  budget?: number;
  production_companies?: {
    id: number | string;
    name: string;
    logo_path?: string;
  }[];
  // Add any other fields that might be common across movie APIs
}

export interface Genre {
  id: number | string;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
  // Some APIs might use different field names
  movies?: Movie[]; // Alternative to results
  pagination?: {
    current_page?: number;
    total_pages?: number;
    total_items?: number;
  };
}
