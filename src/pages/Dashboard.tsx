import { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { getUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import MentorDashboard from './MentorDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  const user = getUser()!;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/40 to-background">
      <Navbar />
      <DashboardSidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-60">
        <div className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:hidden">
          <Button type="button" variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold text-foreground">
            {user.role === 'mentor' ? 'Mentor Panel' : 'Student Panel'}
          </span>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              </div>
            </div>
          </div>

          {user.role === 'mentor' ? <MentorDashboard /> : <StudentDashboard />}
        </main>
      </div>
    </div>
  );
}
