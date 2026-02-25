import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, SearchX } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn("404: Route not found:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <SearchX className="h-8 w-8" />
          </div>
          <h1 className="mb-1 text-5xl font-bold tracking-tight text-foreground">404</h1>
          <p className="mb-6 text-muted-foreground">This page doesn't exist or was moved.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
