
import React, { useState, useEffect, useCallback } from 'react';
import { Task, Habit, RecurrenceType } from './types';
import TaskList from './components/TaskList';
import HabitTracker from './components/HabitTracker';
import ReportView from './components/ReportView';
// Fix: Removed PlusIcon which was missing in Icons.tsx and not used in this file
import { ClipboardIcon, FireIcon, ChartBarIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'habits' | 'reports'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load data
  useEffect(() => {
    const savedTasks = localStorage.getItem('zen_tasks');
    const savedHabits = localStorage.getItem('zen_habits');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHabits) setHabits(JSON.parse(savedHabits));

    // Handle Recurring logic on mount (reset daily/weekly completed statuses if needed)
    // For a real app, this would check if a new day has started
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('zen_tasks', JSON.stringify(tasks));
    localStorage.setItem('zen_habits', JSON.stringify(habits));
  }, [tasks, habits]);

  const addTask = (title: string, recurrence: RecurrenceType) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      recurrence,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      icon: '✨',
      history: {},
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const newHistory = { ...h.history };
        newHistory[today] = !newHistory[today];
        return { ...h, history: newHistory };
      }
      return h;
    }));
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pr-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed right-0 top-0 bottom-0 w-64 glass p-6 border-l border-white/10 z-50">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-indigo-400 to-purple-400 mb-10">
          ZenDo
        </h1>
        <nav className="space-y-4">
          <NavItem 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            icon={<ClipboardIcon />} 
            label="لیست کارها" 
          />
          <NavItem 
            active={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')} 
            icon={<FireIcon />} 
            label="عادت‌ها" 
          />
          <NavItem 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
            icon={<ChartBarIcon />} 
            label="گزارش عملکرد" 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">سلام، خوش اومدی! 👋</h2>
            <p className="text-slate-400 mt-1">بیایم امروز رو عالی بسازیم.</p>
          </div>
          <div className="md:hidden text-indigo-400 font-bold text-xl">ZenDo</div>
        </header>

        {activeTab === 'tasks' && (
          <TaskList tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        {activeTab === 'habits' && (
          <HabitTracker habits={habits} onAdd={addHabit} onToggle={toggleHabit} />
        )}
        {activeTab === 'reports' && (
          <ReportView tasks={tasks} habits={habits} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass rounded-2xl flex justify-around p-3 z-50 border border-white/10 shadow-2xl">
        <MobileNavItem 
          active={activeTab === 'tasks'} 
          onClick={() => setActiveTab('tasks')} 
          icon={<ClipboardIcon />} 
        />
        <MobileNavItem 
          active={activeTab === 'habits'} 
          onClick={() => setActiveTab('habits')} 
          icon={<FireIcon />} 
        />
        <MobileNavItem 
          active={activeTab === 'reports'} 
          onClick={() => setActiveTab('reports')} 
          icon={<ChartBarIcon />} 
        />
      </nav>
    </div>
  );
};

// Internal Nav Components
const NavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active ? 'active-tab' : 'hover:bg-white/5 text-slate-400'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${active ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
  >
    {React.cloneElement(icon, { size: 24 })}
  </button>
);

export default App;
