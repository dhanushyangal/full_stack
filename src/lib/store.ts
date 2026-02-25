export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: string;
  assignedGroups: string[];
  groups: Group[];
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  progress: number;
  tasks: Task[];
  submissions: Submission[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Submission {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'reviewed' | 'approved';
  fileName?: string;
}

const STORAGE_KEY = 'eduvista_data';

export const ALL_GROUPS: Group[] = [
  {
    id: 'g1', name: 'Group Alpha', members: ['Alex Johnson', 'Maria Garcia', 'James Lee'],
    progress: 65,
    tasks: [
      { id: 't1', title: 'Research campus map APIs', completed: true },
      { id: 't2', title: 'Design UI wireframes', completed: true },
      { id: 't3', title: 'Implement pathfinding algorithm', completed: false },
      { id: 't4', title: 'Build mobile-friendly frontend', completed: false },
      { id: 't5', title: 'Write project documentation', completed: false },
    ],
    submissions: [
      { id: 's1', title: 'Project Proposal', date: '2026-02-01', status: 'approved' },
      { id: 's2', title: 'Progress Report 1', date: '2026-02-15', status: 'reviewed' },
    ],
  },
  {
    id: 'g2', name: 'Group Beta', members: ['Sarah Kim', 'David Park', 'Emma Wilson'],
    progress: 35,
    tasks: [
      { id: 't6', title: 'Gather requirements', completed: true },
      { id: 't7', title: 'Create database schema', completed: false },
      { id: 't8', title: 'Develop API endpoints', completed: false },
      { id: 't9', title: 'Integration testing', completed: false },
    ],
    submissions: [
      { id: 's3', title: 'Project Proposal', date: '2026-02-01', status: 'approved' },
    ],
  },
  {
    id: 'g3', name: 'Group Gamma', members: ['Ryan Chen', 'Lisa Wang', 'Tom Brown'],
    progress: 90,
    tasks: [
      { id: 't10', title: 'Setup project infrastructure', completed: true },
      { id: 't11', title: 'Implement core features', completed: true },
      { id: 't12', title: 'UI polish and testing', completed: true },
      { id: 't13', title: 'Final documentation', completed: false },
    ],
    submissions: [
      { id: 's4', title: 'Project Proposal', date: '2026-02-01', status: 'approved' },
      { id: 's5', title: 'Progress Report 1', date: '2026-02-15', status: 'approved' },
      { id: 's6', title: 'Progress Report 2', date: '2026-03-01', status: 'pending' },
    ],
  },
  {
    id: 'g4', name: 'Group Delta', members: ['Nina Patel', 'Oscar Rivera', 'Fiona Zhang'],
    progress: 0,
    tasks: [],
    submissions: [],
  },
];

function defaultData(): { projects: Project[] } {
  return {
    projects: [
      {
        id: '1',
        title: 'Smart Campus Navigation System',
        description: 'Build a navigation system for campus wayfinding using real-time data and pathfinding algorithms.',
        deadline: '2026-04-15',
        assignedGroups: ['g1', 'g2', 'g3'],
        groups: ALL_GROUPS.slice(0, 3),
      },
    ],
  };
}

export function getData(): { projects: Project[] } {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const data = defaultData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function saveData(data: { projects: Project[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function deleteProject(projectId: string) {
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== projectId);
  saveData(data);
  return data;
}

export function getDeadlineInfo(deadline: string): { daysLeft: number; urgency: 'critical' | 'warning' | 'safe' | 'overdue' } {
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { daysLeft, urgency: 'overdue' };
  if (daysLeft <= 7) return { daysLeft, urgency: 'critical' };
  if (daysLeft <= 21) return { daysLeft, urgency: 'warning' };
  return { daysLeft, urgency: 'safe' };
}
