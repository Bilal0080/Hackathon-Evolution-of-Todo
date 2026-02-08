
import React from 'react';
import { AppPhase } from '../types';

interface HeaderProps {
  activePhase: AppPhase;
  onPhaseChange: (phase: AppPhase) => void;
}

const Header: React.FC<HeaderProps> = ({ activePhase, onPhaseChange }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/20">
          P
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Hackathon II</h1>
          <p className="text-xs text-slate-400 font-medium">Evolution of Todo</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
        {Object.values(AppPhase).map((phase) => (
          <button
            key={phase}
            onClick={() => onPhaseChange(phase)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePhase === phase
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {phase}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-500 font-medium">Phase II Deployment</span>
          <span className="text-sm text-green-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            GKE Stable
          </span>
        </div>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <i className="fa-solid fa-gear"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
