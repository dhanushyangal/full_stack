import { Link } from 'react-router-dom';
import { GraduationCap, Users, BarChart3, CheckCircle, ArrowRight, BookOpen, User } from 'lucide-react';
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
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" aria-hidden />
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">EduVista</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Student Group Project
            <br />
            <span className="text-primary">Management System</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            EduVista helps students and mentors collaborate effectively with structured task management, progress tracking, and submission workflows.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary hover:border-primary/20 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/30 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Everything you need</h2>
            <p className="mx-auto max-w-lg text-muted-foreground">Manage academic group projects from start to finish.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group animate-in rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">Two roles, one platform</h2>
            <p className="text-muted-foreground">Designed for both mentors and students.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/20 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Mentor</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">• Create and assign projects</li>
                <li className="flex items-center gap-2">• Monitor group progress</li>
                <li className="flex items-center gap-2">• Review submissions</li>
                <li className="flex items-center gap-2">• Track deadlines</li>
              </ul>
            </div>
            <div className="flex flex-col rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/20 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Student</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">• View assigned projects</li>
                <li className="flex items-center gap-2">• Manage and track tasks</li>
                <li className="flex items-center gap-2">• Monitor progress</li>
                <li className="flex items-center gap-2">• Submit work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">Ready to get started?</h2>
          <p className="mb-6 text-muted-foreground">Create your account and start collaborating today.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">EduVista</span>
          </div>
          <p className="text-center text-sm text-muted-foreground sm:text-right">
            © {new Date().getFullYear()} EduVista – Student Group Project Management
          </p>
        </div>
      </footer>
    </div>
  );
}
