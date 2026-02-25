export type UserRole = 'mentor' | 'student';

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

interface StoredUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

const USERS_KEY = 'eduvista_users';
const SESSION_KEY = 'eduvista_user';

// Default demo users
const DEFAULT_USERS: StoredUser[] = [
  { email: 'mentor@eduvista.edu', password: 'mentor123', name: 'Dr. Sarah Chen', role: 'mentor' },
  { email: 'student@eduvista.edu', password: 'student123', name: 'Alex Johnson', role: 'student' },
];

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name: string, email: string, password: string, role: UserRole): { success: boolean; error?: string } {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length < 2) return { success: false, error: 'Name must be at least 2 characters.' };
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return { success: false, error: 'Please enter a valid email address.' };
  if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

  const users = getStoredUsers();
  if (users.find(u => u.email === trimmedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  users.push({ email: trimmedEmail, password, name: trimmedName, role });
  saveStoredUsers(users);
  return { success: true };
}

export function login(email: string, password: string): User | null {
  const users = getStoredUsers();
  const entry = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
  if (entry) {
    const user: User = { name: entry.name, role: entry.role, email: entry.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function getUser(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
