import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, BookOpen, UserPlus, ArrowRight } from 'lucide-react';
import { signup, UserRole } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!role) { setError('Please select a role.'); return; }
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    const result = signup(name, email, password, role);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-background p-6 shadow-lg sm:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h1>
              <p className="mt-2 text-sm text-muted-foreground">Fill in your details to get started</p>
            </div>

            {success && (
              <div className="mb-4 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status">
                ✓ Account created! Redirecting to login...
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <Label className="mb-1.5 block">Select Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setRole('mentor')}
                  className={role === 'mentor' ? 'border-primary bg-primary/5 text-primary' : ''}>
                  <BookOpen className="h-3.5 w-3.5" /> Mentor
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setRole('student')}
                  className={role === 'student' ? 'border-primary bg-primary/5 text-primary' : ''}>
                  <User className="h-3.5 w-3.5" /> Student
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" autoComplete="name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" autoComplete="email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" className="pr-9" autoComplete="new-password" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <div className="relative">
                  <Input id="signup-confirm" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="pr-9" autoComplete="new-password" />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={success} className="w-full">
                <UserPlus className="h-4 w-4" /> Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring">
                Sign In <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
