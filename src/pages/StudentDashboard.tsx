import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2, CheckCircle, Circle, Calendar, Upload, Send, Edit3, X, Check, Clock, AlertTriangle, FileText, ListTodo, Briefcase, Users } from 'lucide-react';
import { getData, saveData, getDeadlineInfo, getProjectAndGroupForStudent } from '@/lib/store';
import { getUser } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function StudentDashboard() {
  const location = useLocation();
  const section = location.hash.replace('#', '') || '';
  const currentUser = getUser()!;
  const [data, setData] = useState(() => getData());
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitFile, setSubmitFile] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  const assignment = getProjectAndGroupForStudent(currentUser.name);
  const project = assignment?.project ?? null;
  const group = assignment?.group ?? null;
  const projectInData = project ? data.projects.find(p => p.id === project.id) : null;
  const groupInData = projectInData?.groups.find(g => g.id === group?.id);
  const effectiveGroup = groupInData ?? group;
  const effectiveProject = projectInData ?? project;

  const recalcProgress = (tasks: { completed: boolean }[]) =>
    tasks.length ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;

  const currentProgress = effectiveGroup ? recalcProgress(effectiveGroup.tasks) : 0;

  const updateData = (mutator: (d: { projects: typeof data.projects }) => void) => {
    const updated = deepClone(data);
    mutator(updated);
    if (project && effectiveGroup) {
      const proj = updated.projects.find(p => p.id === project.id);
      const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
      if (grp) grp.progress = recalcProgress(grp.tasks);
    }
    saveData(updated);
    setData(updated);
  };

  const toggleTask = (taskId: string) => {
    if (!project || !effectiveGroup) return;
    updateData(d => {
      const proj = d.projects.find(p => p.id === project.id);
      const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
      const task = grp?.tasks.find(t => t.id === taskId);
      if (task) task.completed = !task.completed;
    });
  };

  const addTask = (title?: string) => {
    const taskTitle = title || newTask.trim();
    if (!taskTitle || !project || !effectiveGroup) return;
    updateData(d => {
      const proj = d.projects.find(p => p.id === project.id);
      const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
      if (grp) grp.tasks.push({ id: Date.now().toString(), title: taskTitle, completed: false });
    });
    if (!title) setNewTask('');
  };

  const removeTask = (taskId: string) => {
    if (!project || !effectiveGroup) return;
    updateData(d => {
      const proj = d.projects.find(p => p.id === project.id);
      const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
      if (grp) grp.tasks = grp.tasks.filter(t => t.id !== taskId);
    });
  };

  const startEditTask = (taskId: string, title: string) => {
    setEditingTaskId(taskId);
    setEditingTaskTitle(title);
  };

  const saveEditTask = () => {
    if (!editingTaskId || !editingTaskTitle.trim() || !project || !effectiveGroup) return;
    updateData(d => {
      const proj = d.projects.find(p => p.id === project.id);
      const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
      const task = grp?.tasks.find(t => t.id === editingTaskId);
      if (task) task.title = editingTaskTitle.trim();
    });
    setEditingTaskId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim() || !project || !effectiveGroup) return;
    const updated = deepClone(data);
    const proj = updated.projects.find(p => p.id === project.id);
    const grp = proj?.groups.find(g => g.id === effectiveGroup.id);
    if (grp) {
      grp.submissions.push({
        id: Date.now().toString(),
        title: submitTitle.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        fileName: submitFile.trim() || undefined,
      });
    }
    saveData(updated);
    setData(updated);
    setSubmitted(true);
    setSubmitTitle('');
    setSubmitFile('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const deadlineInfo = effectiveProject ? getDeadlineInfo(effectiveProject.deadline) : null;

  const UnassignedBlock = () => (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
      <Briefcase className="mb-3 h-12 w-12 text-muted-foreground" />
      <p className="font-semibold text-foreground">You're not assigned to any project yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Your mentor will assign you to a project and group. Check back later or contact your mentor.</p>
    </div>
  );

  const DeadlineBadge = () => {
    if (!deadlineInfo) return null;
    const colors = {
      overdue: 'text-destructive bg-destructive/10',
      critical: 'text-destructive bg-destructive/10',
      warning: 'text-warning bg-warning/10',
      safe: 'text-success bg-success/10',
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${colors[deadlineInfo.urgency]}`}>
        {deadlineInfo.urgency === 'overdue' ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
        {deadlineInfo.daysLeft < 0 ? `${Math.abs(deadlineInfo.daysLeft)}d overdue` : `${deadlineInfo.daysLeft} days left`}
      </span>
    );
  };

  const getProgressMessage = (p: number) => {
    if (p < 40) return 'Behind schedule – consider prioritizing critical tasks.';
    if (p <= 80) return 'Good progress – keep up the consistent effort.';
    return 'Excellent work – almost completed!';
  };

  return (
    <div className="space-y-6">
      {(section === '' || section === 'dashboard') && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Student Dashboard</h1>

          {!effectiveProject || !effectiveGroup ? (
            <UnassignedBlock />
          ) : (
            <>
              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="font-medium text-foreground">{effectiveProject.title}</h2>
                  <DeadlineBadge />
                </div>
                <p className="mb-2 flex items-center gap-1 text-sm text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Deadline: {effectiveProject.deadline}</p>
                <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-3.5 w-3.5" /> Your group: {effectiveGroup.name} · {effectiveGroup.members.join(', ')}</p>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{currentProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${currentProgress}%` }} role="progressbar" aria-label="Project progress" aria-valuenow={String(currentProgress)} aria-valuemin="0" aria-valuemax="100" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{getProgressMessage(currentProgress)}</p>
              </div>

              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-foreground">Recent Tasks</h3>
                {effectiveGroup.tasks.length ? (
                  <div className="space-y-2">
                    {effectiveGroup.tasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                    {t.completed ? <CheckCircle className="h-4 w-4 shrink-0 text-success" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span className={`text-sm flex-1 ${t.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{t.title}</span>
                  </div>
                ))}
              </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center">
                    <ListTodo className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">No tasks yet</p>
                    <p className="text-xs text-muted-foreground">Add tasks in the Task Management section.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {section === 'project' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Project</h1>
          {!effectiveProject || !effectiveGroup ? (
            <UnassignedBlock />
          ) : (
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h2 className="text-lg font-semibold text-foreground">{effectiveProject.title}</h2>
                <DeadlineBadge />
              </div>
              {effectiveProject.description && <p className="mb-3 text-sm text-muted-foreground">{effectiveProject.description}</p>}
              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Group: <span className="font-medium text-foreground">{effectiveGroup.name}</span></p>
                <p>Members: {effectiveGroup.members.join(', ')}</p>
                <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Deadline: {effectiveProject.deadline}</p>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Overall progress</span>
                <span className="font-semibold text-foreground">{currentProgress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${currentProgress}%` }} role="progressbar" aria-label="Project progress" aria-valuenow={String(currentProgress)} aria-valuemin="0" aria-valuemax="100" />
              </div>
            </div>
          )}
        </div>
      )}

      {section === 'tasks' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Task Management</h1>
          {!effectiveProject || !effectiveGroup ? (
            <UnassignedBlock />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Track and update tasks for <span className="font-medium text-foreground">{effectiveProject.title}</span> · Group {effectiveGroup.name}</p>
              <div className="flex gap-2">
                <Input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add a new task..." className="flex-1" />
                <Button type="button" onClick={() => addTask()}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion ({effectiveGroup.tasks.filter(t => t.completed).length}/{effectiveGroup.tasks.length})</span>
                  <span className="font-semibold text-foreground">{currentProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${currentProgress}%` }} role="progressbar" aria-label="Task completion" aria-valuenow={String(currentProgress)} aria-valuemin="0" aria-valuemax="100" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{getProgressMessage(currentProgress)}</p>
              </div>

              {effectiveGroup.tasks.length ? (
                <div className="space-y-2">
                  {effectiveGroup.tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
                  {editingTaskId === t.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <Input value={editingTaskTitle} onChange={e => setEditingTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditTask()} className="flex-1" autoFocus />
                      <Button type="button" variant="ghost" size="icon" onClick={saveEditTask} className="text-success hover:text-success"><Check className="h-4 w-4" /></Button>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setEditingTaskId(null)}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <>
                      <button type="button" onClick={() => toggleTask(t.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                        {t.completed ? <CheckCircle className="h-4 w-4 shrink-0 text-success" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                        <span className={`text-sm truncate ${t.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{t.title}</span>
                      </button>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => startEditTask(t.id, t.title)} aria-label="Edit task">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeTask(t.id)} aria-label="Delete task">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                  <ListTodo className="mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">No tasks yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Add a task above to get started.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {section === 'submit' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Submit Work</h1>
          {!effectiveProject || !effectiveGroup ? (
            <UnassignedBlock />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Submit work for <span className="font-medium text-foreground">{effectiveProject.title}</span>. Your mentor will review and update status.</p>
              <form onSubmit={handleSubmit} className="max-w-lg rounded-xl border border-border bg-background p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">New Submission</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="submit-title">Submission Title *</Label>
                    <Input id="submit-title" value={submitTitle} onChange={e => setSubmitTitle(e.target.value)} placeholder="e.g., Progress Report 3" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submit-file">File name (optional)</Label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input id="submit-file" value={submitFile} onChange={e => setSubmitFile(e.target.value)} placeholder="e.g., report_v3.pdf" className="flex-1" />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="mt-4">
                  <Send className="h-4 w-4" /> Submit
                </Button>
                {submitted && <p className="mt-4 rounded-lg bg-success/10 px-4 py-2 text-sm font-medium text-success">✓ Submission sent! Your mentor will review it.</p>}
              </form>

              <div>
                <h2 className="mb-3 text-base font-semibold text-foreground">Your Submissions</h2>
                <p className="mb-3 text-xs text-muted-foreground">Status is updated by your mentor. Pending = awaiting review; Reviewed = feedback given; Approved = accepted.</p>
                {effectiveGroup.submissions.length ? (
                  <div className="space-y-2">
                    {effectiveGroup.submissions.map(s => {
                      const statusLabel = s.status === 'approved' ? 'Approved – Accepted by mentor' : s.status === 'reviewed' ? 'Reviewed – Mentor has provided feedback' : 'Pending – Awaiting mentor review';
                      return (
                        <div key={s.id} className="flex flex-col gap-1 rounded-xl border border-border bg-background px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{s.date}</span>
                              {s.fileName && <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {s.fileName}</span>}
                            </div>
                          </div>
                          <span className={`inline-flex w-fit rounded-lg px-2.5 py-1 text-xs font-medium ${
                            s.status === 'approved' ? 'bg-success/10 text-success' :
                            s.status === 'reviewed' ? 'bg-warning/10 text-warning' :
                            'bg-secondary text-muted-foreground'
                          }`} title={statusLabel}>
                            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                    <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">No submissions yet</p>
                    <p className="text-xs text-muted-foreground">Submit your first piece of work above.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
