
import React, { useState, useEffect } from 'react';
import { Task, Habit } from '../types';
import { generateAIReport } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  tasks: Task[];
  habits: Habit[];
}

const ReportView: React.FC<Props> = ({ tasks, habits }) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const stats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const taskCompleted = tasks.filter(t => t.completed).length;
    const taskTotal = tasks.length;
    
    const habitCompleted = habits.filter(h => h.history[today]).length;
    const habitTotal = habits.length;

    return {
      taskDone: taskCompleted,
      taskRemain: taskTotal - taskCompleted,
      habitDone: habitCompleted,
      habitRemain: habitTotal - habitCompleted
    };
  }, [tasks, habits]);

  const taskData = [
    { name: 'انجام شده', value: stats.taskDone, color: '#6366f1' },
    { name: 'باقیمانده', value: stats.taskRemain || 1, color: '#1e293b' }
  ];

  const getAIReport = async () => {
    setLoading(true);
    const feedback = await generateAIReport(tasks, habits, reportType);
    setAiResponse(feedback);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex bg-slate-900 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setReportType('daily')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'daily' ? 'bg-indigo-600 shadow-lg' : 'text-slate-500'}`}
        >
          گزارش روزانه
        </button>
        <button 
          onClick={() => setReportType('weekly')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${reportType === 'weekly' ? 'bg-indigo-600 shadow-lg' : 'text-slate-500'}`}
        >
          گزارش هفتگی
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl flex flex-col items-center">
          <h3 className="font-bold mb-4">وضعیت تسک‌ها</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-black mt-2">{stats.taskDone} <span className="text-sm text-slate-500 font-normal">از {tasks.length}</span></p>
        </div>

        <div className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center">
          <h3 className="font-bold mb-2">امتیاز عادت‌ها</h3>
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center text-3xl font-black mb-4">
            {stats.habitDone}
          </div>
          <p className="text-slate-400">عادت‌های تیک خورده برای امروز</p>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border-t-4 border-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            ✨ تحلیل هوشمند (Gemini AI)
          </h3>
          <button 
            onClick={getAIReport}
            disabled={loading}
            className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20"
          >
            {loading ? 'در حال تحلیل...' : 'به‌روزرسانی تحلیل'}
          </button>
        </div>
        
        <div className="bg-slate-900/50 p-6 rounded-2xl min-h-[100px] flex items-center leading-relaxed italic text-indigo-100">
          {aiResponse || "دکمه به‌روزرسانی رو بزن تا تحلیلگر هوشمند عملکردت رو بررسی کنه!"}
        </div>
      </div>
    </div>
  );
};

export default ReportView;
