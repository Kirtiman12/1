import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, Home, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import Loader from "./ui/Loader";

const Header = () => {
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-movie-dark shadow-lg py-2"
          : "bg-gradient-to-b from-movie-dark to-transparent py-3"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Loader className="scale-[0.8] md:scale-[1] relative top-[5px] md:top-[10px]" />
          <span className="text-[15px] md:text-xl font-Angelos">
            Discover Movies
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          {!isMobile && (
            <form onSubmit={handleSearch} className="relative mr-4">
              <Input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-black bg-opacity-50 text-white w-60 rounded-full border-none"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full text-movie-light-gray hover:text-white"
              >
                <Search size={18} />
              </Button>
            </form>
          )}

          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`${
                location.pathname === "/" ? "text-movie-red" : "text-white"
              } hover:custom-40`}
            >
              <Link to="/">
                <Home size={isMobile ? 20 : 22} />
                {!isMobile && <span className="sr-only">Home</span>}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`${
                location.pathname === "/favorites"
                  ? "text-movie-red"
                  : "text-white"
              } hover:custom-40`}
            >
              <Link to="/favorites">
                <Heart size={isMobile ? 20 : 22} />
                {!isMobile && <span className="sr-only">Favorites</span>}
              </Link>
            </Button>

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`${
                  location.pathname.includes("/search")
                    ? "text-movie-red"
                    : "text-white"
                } hover:text-movie-red`}
              >
                <Link to="/search">
                  <Search size={20} />
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
