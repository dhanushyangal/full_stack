import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderPlus, Users, FileCheck, LogOut, Briefcase, ListTodo, Upload, GraduationCap, X } from 'lucide-react';
import { UserRole, logout } from '@/lib/auth';

interface Props {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}

const mentorLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', hash: '' },
  { icon: FolderPlus, label: 'Create Project', hash: 'create' },
  { icon: Users, label: 'Groups', hash: 'groups' },
  { icon: FileCheck, label: 'Submissions', hash: 'submissions' },
];

const studentLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', hash: '' },
  { icon: Briefcase, label: 'My Project', hash: 'project' },
  { icon: ListTodo, label: 'Tasks', hash: 'tasks' },
  { icon: Upload, label: 'Submit Work', hash: 'submit' },
];

export default function DashboardSidebar({ role, open, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = role === 'mentor' ? mentorLinks : studentLinks;
  const currentHash = location.hash.replace('#', '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-foreground/20 md:hidden" onClick={onClose} aria-hidden />}

      <aside className={`fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-border bg-background transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">EduVista</span>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close sidebar"><X className="h-4 w-4" /></button>
        </div>

        <div className="px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {role === 'mentor' ? 'Mentor Panel' : 'Student Panel'}
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {links.map(({ icon: Icon, label, hash }) => {
            const active = currentHash === hash;
            return (
              <Link
                key={hash}
                to={`/dashboard#${hash}`}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {active && <div className="absolute left-0 h-5 w-0.5 rounded-full bg-primary" />}
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
