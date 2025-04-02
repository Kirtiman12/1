import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import Index from "./pages/Homepage";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Genre from "./pages/Genre";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/genre/:id" element={<Genre />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </BrowserRouter>
        </ThemeProvider>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
