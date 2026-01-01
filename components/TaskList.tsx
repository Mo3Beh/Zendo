
import React, { useState } from 'react';
import { Task, RecurrenceType } from '../types';
import { TrashIcon, CheckCircleIcon, CalendarIcon } from './Icons';

interface Props {
  tasks: Task[];
  onAdd: (title: string, recurrence: RecurrenceType) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<Props> = ({ tasks, onAdd, onToggle, onDelete }) => {
  const [newTitle, setNewTitle] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd(newTitle, recurrence);
    setNewTitle('');
    setRecurrence('none');
  };

  const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
    { value: 'none', label: 'بدون تکرار' },
    { value: 'daily', label: 'روزانه' },
    { value: 'weekly', label: 'هفتگی' },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="glass p-5 rounded-2xl border border-white/5 space-y-5">
        <input 
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="چه کاری باید انجام شه؟"
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
        />
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Segmented Control for Recurrence */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl w-full sm:w-auto border border-white/5">
            {recurrenceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRecurrence(option.value)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  recurrence === option.value 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full sm:w-auto sm:mr-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            اضافه کن
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`group flex items-center justify-between glass p-4 rounded-2xl transition-all hover:scale-[1.01] ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}
          >
            <div className="flex items-center gap-4">
              <button onClick={() => onToggle(task.id)} className="text-2xl outline-none">
                {task.completed ? <CheckCircleIcon filled /> : <div className="w-6 h-6 border-2 border-slate-600 rounded-full hover:border-indigo-400 transition-colors" />}
              </button>
              <div>
                <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{task.title}</h3>
                {task.recurrence !== 'none' && (
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full flex items-center gap-1 mt-1 w-fit border border-indigo-500/20">
                    <CalendarIcon size={10} />
                    {task.recurrence === 'daily' ? 'تکرار روزانه' : 'تکرار هفتگی'}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => onDelete(task.id)}
              className="text-red-400 sm:opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              title="حذف تسک"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-slate-500 font-medium">هنوز تسکی نداری. اولین تسک رو بساز!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
