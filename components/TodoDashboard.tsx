
import React, { useState } from 'react';
import { Todo, Priority, TaskStatus } from '../types';

interface TodoDashboardProps {
  todos: Todo[];
  onAdd: (todo: Partial<Todo>) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const TodoDashboard: React.FC<TodoDashboardProps> = ({ todos, onAdd, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState<'All' | TaskStatus>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);

  const filteredTodos = todos.filter(t => filter === 'All' || t.status === filter);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd({
      title: newTitle,
      priority: newPriority,
      status: TaskStatus.PENDING,
      category: 'General'
    });
    setNewTitle('');
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case Priority.HIGH: return 'text-red-400 bg-red-400/10 border-red-400/20';
      case Priority.MEDIUM: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case Priority.LOW: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Quick Add Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Priority)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 focus:outline-none"
        >
          {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          Add Task
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFilter('All')}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${filter === 'All' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter(TaskStatus.PENDING)}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${filter === TaskStatus.PENDING ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter(TaskStatus.COMPLETED)}
            className={`text-sm font-semibold px-3 py-1 rounded-full transition-all ${filter === TaskStatus.COMPLETED ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Completed
          </button>
        </div>
        <div className="text-slate-500 text-sm font-medium">
          {filteredTodos.length} Tasks Found
        </div>
      </div>

      {/* Todo List */}
      <div className="grid gap-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`group flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl hover:border-slate-700 transition-all ${todo.status === TaskStatus.COMPLETED ? 'opacity-60' : ''}`}
          >
            <button
              onClick={() => onUpdate(todo.id, { status: todo.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED })}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.status === TaskStatus.COMPLETED
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-700 hover:border-emerald-500'
              }`}
            >
              {todo.status === TaskStatus.COMPLETED && <i className="fa-solid fa-check text-[10px]"></i>}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${todo.status === TaskStatus.COMPLETED ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {todo.title}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(todo.priority)}`}>
                  {todo.priority}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  #{todo.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => onDelete(todo.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-slate-700 text-5xl mb-4">
              <i className="fa-solid fa-clipboard-list"></i>
            </div>
            <h3 className="text-slate-400 font-medium">No tasks found in this view.</h3>
            <p className="text-slate-600 text-sm">Time to add something to your sprint!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoDashboard;
