import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, X, UserPlus } from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { useState } from 'react';

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md" role="navigation" aria-label="Main">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">EduVista</span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          <Link to="/" className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                Dashboard
              </Link>
              <button type="button" onClick={handleLogout} className="ml-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                Sign In
              </Link>
              <Link to="/signup" className="ml-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow">
                <UserPlus className="h-4 w-4" /> Sign Up
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary md:hidden" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen ? "true" : "false"}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden animate-in">
          <div className="flex flex-col gap-0.5">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">Dashboard</Link>
                <button type="button" onClick={() => { handleLogout(); setMobileOpen(false); }} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
