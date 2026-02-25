import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Users, FileCheck, BarChart3, Calendar, Trash2, Edit3, X, Check, Clock, AlertTriangle, CheckCircle, FolderPlus } from 'lucide-react';
import { getData, saveData, deleteProject, getDeadlineInfo, ALL_GROUPS, type Project } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function MentorDashboard() {
  const location = useLocation();
  const section = location.hash.replace('#', '') || '';
  const [data, setData] = useState(() => getData());
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setData(getData()), 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleGroupSelection = (gId: string) => {
    setSelectedGroups(prev => prev.includes(gId) ? prev.filter(id => id !== gId) : [...prev, gId]);
  };

  const createProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDeadline) return;
    const assignedGroupData = ALL_GROUPS.filter(g => selectedGroups.includes(g.id)).map(g => ({
      ...g, tasks: [], submissions: [], progress: 0,
    }));
    const newProject: Project = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      deadline: newDeadline,
      assignedGroups: selectedGroups,
      groups: assignedGroupData,
    };
    const updated = { projects: [...data.projects, newProject] };
    saveData(updated);
    setData(updated);
    setNewTitle(''); setNewDesc(''); setNewDeadline(''); setSelectedGroups([]);
  };

  const handleDelete = (id: string) => setData(deleteProject(id));

  const startEdit = (p: Project) => {
    setEditingId(p.id); setEditTitle(p.title); setEditDesc(p.description); setEditDeadline(p.deadline);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = { ...data };
    const proj = updated.projects.find(p => p.id === editingId);
    if (proj) { proj.title = editTitle.trim(); proj.description = editDesc.trim(); proj.deadline = editDeadline; }
    saveData(updated);
    setData({ ...updated });
    setEditingId(null);
  };

  const totalGroups = data.projects.reduce((a, p) => a + p.groups.length, 0);
  const allGroups = data.projects.flatMap(p => p.groups);
  const avgProgress = allGroups.length ? Math.round(allGroups.reduce((a, g) => a + g.progress, 0) / allGroups.length) : 0;
  const totalSubmissions = allGroups.reduce((a, g) => a + g.submissions.length, 0);
  const totalTasks = allGroups.reduce((a, g) => a + g.tasks.length, 0);
  const completedTasks = allGroups.reduce((a, g) => a + g.tasks.filter(t => t.completed).length, 0);
  const pendingSubmissions = allGroups.reduce((a, g) => a + g.submissions.filter(s => s.status === 'pending').length, 0);

  const DeadlineCountdown = ({ deadline }: { deadline: string }) => {
    const { daysLeft, urgency } = getDeadlineInfo(deadline);
    const colors = {
      overdue: 'text-destructive bg-destructive/10',
      critical: 'text-destructive bg-destructive/10',
      warning: 'text-warning bg-warning/10',
      safe: 'text-success bg-success/10',
    };
    const icons = { overdue: AlertTriangle, critical: AlertTriangle, warning: Clock, safe: CheckCircle };
    const Icon = icons[urgency];
    return (
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors[urgency]}`}>
        <Icon className="h-3 w-3" />
        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {(section === '' || section === 'dashboard') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mentor Dashboard</h1>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BarChart3, label: 'Total Projects', value: data.projects.length },
              { icon: Users, label: 'Total Groups', value: totalGroups },
              { icon: FileCheck, label: 'Pending Submissions', value: pendingSubmissions },
              { icon: CheckCircle, label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Overview */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-foreground">Progress Overview</h2>
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Average</span>
                <span className="font-semibold text-foreground">{avgProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${avgProgress}%` }} role="progressbar" aria-label="Overall progress" aria-valuenow={avgProgress} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
            <div className="space-y-3">
              {data.projects[0]?.groups.map(g => (
                <div key={g.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">{g.name}</span>
                    <span className="font-medium text-foreground">{g.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/70 transition-all duration-500" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'create' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create & Manage Projects</h1>

          <form onSubmit={createProject} className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-foreground">
              <Plus className="h-5 w-5 text-primary" /> New Project
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proj-title">Project Title</Label>
                <Input id="proj-title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Enter project title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proj-deadline">Deadline</Label>
                <Input id="proj-deadline" type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea id="proj-desc" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Project description..." rows={3} className="resize-none" />
            </div>
            <div className="mt-4 space-y-2">
              <Label>Assign Groups</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_GROUPS.map(g => (
                  <Button key={g.id} type="button" variant="outline" size="sm" onClick={() => toggleGroupSelection(g.id)}
                    className={selectedGroups.includes(g.id) ? 'border-primary bg-primary/10 text-primary' : ''}>
                    {g.name}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="submit" className="mt-5">
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          </form>

          <div>
            <h2 className="mb-4 text-base font-semibold text-foreground">All Projects ({data.projects.length})</h2>
            {data.projects.length ? (
            <div className="space-y-3">
              {data.projects.map(p => (
                <div key={p.id} className="rounded-xl border border-border bg-background p-5 shadow-sm">
                  {editingId === p.id ? (
                    <div className="space-y-4">
                      <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Project title" />
                      <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2} className="resize-none" />
                      <Input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} />
                      <div className="flex gap-2">
                        <Button type="button" variant="default" size="sm" onClick={saveEdit} className="bg-success hover:bg-success/90">
                          <Check className="h-3 w-3" /> Save
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="h-3 w-3" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{p.title}</p>
                          <DeadlineCountdown deadline={p.deadline} />
                        </div>
                        {p.description && <p className="text-sm text-muted-foreground mb-2">{p.description}</p>}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {p.deadline}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.groups.length} groups</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground" onClick={() => startEdit(p)} aria-label="Edit project">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDelete(p.id)} aria-label="Delete project">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                <FolderPlus className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">No projects yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Create your first project using the form above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {section === 'groups' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Groups</h1>
          <div className="space-y-4">
            {data.projects.flatMap(p => p.groups.map(g => ({ ...g, projectTitle: p.title, deadline: p.deadline }))).map(g => {
              const taskRatio = g.tasks.length ? `${g.tasks.filter(t => t.completed).length}/${g.tasks.length}` : '0/0';
              return (
                <div key={g.id} className="rounded-xl border border-border bg-background p-5 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{g.name}</h3>
                      <p className="text-xs text-muted-foreground">{g.projectTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <DeadlineCountdown deadline={g.deadline} />
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{g.progress}%</span>
                    </div>
                  </div>
                  <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${g.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Members: {g.members.join(', ')}</span>
                    <span>Tasks: {taskRatio}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {section === 'submissions' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Submissions</h1>
          <div className="overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submission</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">File</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.flatMap(p => p.groups.flatMap(g =>
                  g.submissions.map(s => (
                    <tr key={s.id} className="border-b border-border last:border-0 transition-colors hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium text-foreground">{g.name}</td>
                      <td className="px-4 py-3 text-foreground">{s.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.fileName || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.date}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          s.status === 'approved' ? 'bg-success/10 text-success' :
                          s.status === 'reviewed' ? 'bg-warning/10 text-warning' :
                          'bg-secondary text-muted-foreground'
                        }`}>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
