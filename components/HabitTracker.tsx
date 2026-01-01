
import React, { useState } from 'react';
import { Habit } from '../types';

interface Props {
  habits: Habit[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
}

const HabitTracker: React.FC<Props> = ({ habits, onAdd, onToggle }) => {
  const [newHabit, setNewHabit] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!newHabit.trim()) return;
    onAdd(newHabit);
    setNewHabit('');
  };

  return (
    <div className="space-y-6">
      <div className="glass p-4 rounded-2xl border border-white/5 flex gap-2">
        <input 
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="عادت جدید..."
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none"
        />
        <button 
          onClick={handleAdd}
          className="px-6 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-all"
        >
          ثبت
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {habits.map(habit => {
          const isDoneToday = habit.history[todayStr];
          return (
            <div 
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${
                isDoneToday 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 border-indigo-400 shadow-lg scale-[0.98]' 
                  : 'glass border-white/5 hover:border-white/10'
              }`}
            >
              <div className="text-4xl">{habit.icon}</div>
              <h3 className="font-bold text-lg text-center">{habit.name}</h3>
              <div className={`px-4 py-1 rounded-full text-sm font-medium ${isDoneToday ? 'bg-white/20' : 'bg-slate-800'}`}>
                {isDoneToday ? 'انجام شد!' : 'هنوز نه'}
              </div>
            </div>
          );
        })}
      </div>
      
      {habits.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          لیست عادت‌ها خالیه. بیا شروع کنیم! 🎯
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
