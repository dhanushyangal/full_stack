import { Link } from 'react-router-dom';
import { GraduationCap, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const features = [
  { icon: Users, title: 'Group Management', desc: 'Organize students into groups and assign projects seamlessly.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Real-time progress bars and milestone tracking for every group.' },
  { icon: CheckCircle, title: 'Task Management', desc: 'Create, assign, and track tasks with automatic progress calculation.' },
  { icon: GraduationCap, title: 'Submissions', desc: 'Submit work, track review status, and manage deadlines.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Student Group Project<br />Management System
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            EduVista helps students and mentors collaborate effectively with structured task management, progress tracking, and submission workflows.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">Features</h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-foreground">Everything you need to manage academic group projects.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-background p-5 transition-shadow hover:shadow-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">Two Roles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-6">
              <div className="mb-3 text-2xl">👨‍🏫</div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Mentor</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Create and assign projects</li>
                <li>• Monitor group progress</li>
                <li>• Review submissions</li>
                <li>• Track deadlines</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-background p-6">
              <div className="mb-3 text-2xl">👨‍🎓</div>
              <h3 className="mb-2 text-base font-semibold text-foreground">Student</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• View assigned projects</li>
                <li>• Manage and track tasks</li>
                <li>• Monitor progress</li>
                <li>• Submit work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          © 2026 EduVista – Student Group Project Management System
        </div>
      </footer>
    </div>
  );
}
