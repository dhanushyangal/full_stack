import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, BookOpen, LogIn, ArrowRight } from 'lucide-react';
import { login, UserRole } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    const user = login(email, password);
    if (user) {
      navigate(from || '/dashboard', { replace: true });
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const selectRole = (r: UserRole) => {
    setRole(r);
    setEmail(r === 'mentor' ? 'mentor@eduvista.edu' : 'student@eduvista.edu');
    setPassword(r === 'mentor' ? 'mentor123' : 'student123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-background p-6 shadow-lg sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign In</h1>
              <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            {/* Quick Role Selection */}
            <div className="mb-4">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground" id="demo-role-label">Quick Demo Login</span>
              <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="demo-role-label">
                <Button type="button" variant="outline" size="sm" onClick={() => selectRole('mentor')}
                  className={role === 'mentor' ? 'border-primary bg-primary/5 text-primary' : ''}>
                  <BookOpen className="h-3.5 w-3.5" /> Mentor
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => selectRole('student')}
                  className={role === 'student' ? 'border-primary bg-primary/5 text-primary' : ''}>
                  <User className="h-3.5 w-3.5" /> Student
                </Button>
              </div>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">or enter credentials</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="pr-9" autoComplete="current-password" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <LogIn className="h-4 w-4" /> Sign In
              </Button>
            </form>

            {role && (
              <p className="mt-3 text-center text-xs text-muted-foreground bg-secondary rounded-md px-2 py-1.5">
                Demo: {role === 'mentor' ? 'mentor@eduvista.edu / mentor123' : 'student@eduvista.edu / student123'}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring">
                Sign Up <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
