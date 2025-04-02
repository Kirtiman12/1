import { useState, useEffect } from "react";
import { fetchGenres } from "@/lib/api";
import { Genre } from "@/types/movie";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const GenreList = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const data = await fetchGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
        setError("Failed to load genres");
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 mb-8">
        <h2 className="section-title">Browse by Genre</h2>
        <ScrollArea className="whitespace-nowrap">
          <div className="flex space-x-4 pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="mt-8 mb-8">
      <h2 className="section-title">Browse by Genre</h2>
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-4 pb-2">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/genre/${genre.id}`}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 bg-movie-gray hover:bg-movie-red transition-colors whitespace-nowrap"
            >
              {genre.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default GenreList;
