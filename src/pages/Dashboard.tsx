import { useState } from 'react';
import { Menu } from 'lucide-react';
import { getUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import MentorDashboard from './MentorDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  const user = getUser()!;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <DashboardSidebar role={user.role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-60">
        <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-2.5 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-foreground">
            {user.role === 'mentor' ? 'Mentor Panel' : 'Student Panel'}
          </span>
        </div>

        <main className="p-4 sm:p-6">
          <div className="mb-5 rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Welcome back,</p>
            <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
          </div>

          {user.role === 'mentor' ? <MentorDashboard /> : <StudentDashboard />}
        </main>
      </div>
    </div>
  );
}
