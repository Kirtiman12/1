import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { useFavorites } from "@/context/FavoritesContext";
import { BackgroundLines } from "./ui/BackgroundLines";
import Switcher from "./ui/Switcher";

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";

  return (
    <div className="relative h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <BackgroundLines className="bg-gray-800 h-full"> </BackgroundLines>
        <div className="absolute inset-0 bg-gradient-to-t from-movie-dark via-movie-dark/80 to-movie-dark/20"></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-12">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-milker text-white/70 select-none">
            Discover Your <br />
            Favorite Movie
          </h1>
          <div className="w-3xs 2xl:w-[45%] h-10">
            <p className="text-[10px] md:text-md lg:text-lg text-custom-50 text-center mx-[30px] font-albert font-bold">
              Explore a vast collection of movies by genre, rating, or trending
              lists. Use our smart search and personalized recommendations to
              find the perfect film for any mood. Start discovering now!
            </p>
          </div>
        </div>
        <div className="absolute top-[2.8rem] md:top-[5rem] right-[-3.2rem] md:right-[-1rem] z-10 scale-[0.45] md:scale-[0.8]">
          <Switcher />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
