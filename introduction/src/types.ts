export interface TodoItem {
  id: string;
  uid: string;
  title: string;
  text?: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  dueDate?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  isGuest: boolean;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'newest' | 'oldest' | 'priority';
