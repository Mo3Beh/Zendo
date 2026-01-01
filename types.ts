
export type RecurrenceType = 'none' | 'daily' | 'weekly';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  recurrence: RecurrenceType;
  createdAt: number;
  completedAt?: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  history: Record<string, boolean>; // date string "YYYY-MM-DD" -> status
}

export interface ReportData {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  aiFeedback?: string;
}
