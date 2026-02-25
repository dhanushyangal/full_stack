import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Users, FileCheck, BarChart3, Calendar, Trash2, Edit3, X, Check, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { getData, saveData, deleteProject, getDeadlineInfo, ALL_GROUPS, type Project } from '@/lib/store';

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

  const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring";

  return (
    <div>
      {(section === '' || section === 'dashboard') && (
        <div>
          <h1 className="mb-5 text-xl font-semibold text-foreground">Mentor Dashboard</h1>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BarChart3, label: 'Total Projects', value: data.projects.length },
              { icon: Users, label: 'Total Groups', value: totalGroups },
              { icon: FileCheck, label: 'Pending Submissions', value: pendingSubmissions },
              { icon: CheckCircle, label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}` },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Overview */}
          <div className="mb-6 rounded-lg border border-border bg-background p-5">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Progress Overview</h2>
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Overall Average</span>
                <span className="font-medium text-foreground">{avgProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${avgProgress}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {data.projects[0]?.groups.map(g => (
                <div key={g.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{g.name}</span>
                    <span className="font-medium text-foreground">{g.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/70 transition-all duration-500" style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'create' && (
        <div>
          <h1 className="mb-5 text-xl font-semibold text-foreground">Create & Manage Projects</h1>

          <form onSubmit={createProject} className="mb-6 rounded-lg border border-border bg-background p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Plus className="h-4 w-4 text-primary" /> New Project
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Project Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Enter project title" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Deadline</label>
                <input type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Project description..." rows={3} className={inputCls + ' resize-none'} />
            </div>
            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Assign Groups</label>
              <div className="flex flex-wrap gap-2">
                {ALL_GROUPS.map(g => (
                  <button key={g.id} type="button" onClick={() => toggleGroupSelection(g.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedGroups.includes(g.id) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
                    }`}>
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Create Project
            </button>
          </form>

          <h2 className="mb-3 text-sm font-semibold text-foreground">All Projects ({data.projects.length})</h2>
          <div className="space-y-2">
            {data.projects.map(p => (
              <div key={p.id} className="rounded-lg border border-border bg-background p-4">
                {editingId === p.id ? (
                  <div className="space-y-2">
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputCls} />
                    <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2} className={inputCls + ' resize-none'} />
                    <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} className={inputCls} />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="inline-flex items-center gap-1 rounded-md bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20">
                        <Check className="h-3 w-3" /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{p.title}</p>
                        <DeadlineCountdown deadline={p.deadline} />
                      </div>
                      {p.description && <p className="text-sm text-muted-foreground mb-1.5">{p.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.deadline}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.groups.length} groups</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(p)} className="rounded-md p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-md p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'groups' && (
        <div>
          <h1 className="mb-5 text-xl font-semibold text-foreground">Student Groups</h1>
          <div className="space-y-3">
            {data.projects.flatMap(p => p.groups.map(g => ({ ...g, projectTitle: p.title, deadline: p.deadline }))).map(g => {
              const taskRatio = g.tasks.length ? `${g.tasks.filter(t => t.completed).length}/${g.tasks.length}` : '0/0';
              return (
                <div key={g.id} className="rounded-lg border border-border bg-background p-4">
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
        <div>
          <h1 className="mb-5 text-xl font-semibold text-foreground">Submissions</h1>
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Group</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Submission</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">File</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.projects.flatMap(p => p.groups.flatMap(g =>
                  g.submissions.map(s => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                      <td className="px-4 py-2.5 text-foreground">{g.name}</td>
                      <td className="px-4 py-2.5 text-foreground">{s.title}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.fileName || '—'}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.date}</td>
                      <td className="px-4 py-2.5">
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
