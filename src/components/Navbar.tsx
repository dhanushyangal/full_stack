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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">EduVista</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}>
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="ml-2 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive hover:border-destructive/30">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Sign In
              </Link>
              <Link to="/signup" className="ml-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <UserPlus className="h-3.5 w-3.5" /> Sign Up
              </Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="rounded-md px-3 py-2 text-sm font-medium text-destructive text-left hover:bg-destructive/5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">Sign In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
