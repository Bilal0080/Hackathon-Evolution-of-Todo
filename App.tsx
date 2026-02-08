
import React, { useState, useEffect } from 'react';
import { AppPhase, Todo, Priority, TaskStatus, SpecFile, ChatMessage } from './types';
import { INITIAL_TODOS, INITIAL_SPECS, HACKATHON_PHASES } from './constants';
import Header from './components/Header';
import TodoDashboard from './components/TodoDashboard';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [activePhase, setActivePhase] = useState<AppPhase>(AppPhase.OVERVIEW);
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [specs, setSpecs] = useState<SpecFile[]>(INITIAL_SPECS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Todo Assistant. I can help you add, list, complete, or delete tasks. What can I do for you today?",
      timestamp: Date.now()
    }
  ]);

  // Todo Handlers
  const addTodo = (todo: Partial<Todo>) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(7),
      title: todo.title || 'Untitled',
      description: todo.description || '',
      priority: todo.priority || Priority.MEDIUM,
      status: todo.status || TaskStatus.PENDING,
      category: todo.category || 'General',
      createdAt: Date.now()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePhase={activePhase} onPhaseChange={setActivePhase} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {activePhase === AppPhase.OVERVIEW && (
          <div className="max-w-5xl mx-auto space-y-12">
            <section className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">The Evolution of Todo</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Mastering Spec-Driven Development & Cloud Native AI Architecture.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActivePhase(AppPhase.TODO_APP)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20"
                >
                  Explore MVP (Phase II)
                </button>
                <button 
                   onClick={() => setActivePhase(AppPhase.SPEC_WORKSPACE)}
                   className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
                >
                  View Specifications
                </button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="text-xl font-bold text-white">Spec-Driven</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every feature originates from a robust specification. No code is written until requirements are finalized in our SDD pipeline.
                </p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <h3 className="text-xl font-bold text-white">AI-Native</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Integrated OpenAI Agents SDK and MCP server architecture to provide natural language task management.
                </p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl space-y-4">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-cloud"></i>
                </div>
                <h3 className="text-xl font-bold text-white">Cloud Native</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Distributed architecture featuring Kafka events, Dapr sidecars, and automated Kubernetes deployments.
                </p>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <i className="fa-solid fa-timeline text-blue-500"></i>
                Evolution Roadmap
              </h3>
              <div className="grid gap-4">
                {HACKATHON_PHASES.map((phase) => (
                  <div 
                    key={phase.id}
                    className="flex items-center gap-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all"
                  >
                    <div className="text-4xl font-black text-slate-800 absolute -right-4 -bottom-4 select-none">
                      0{phase.id}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      phase.status === 'completed' ? 'bg-emerald-500' : 
                      phase.status === 'current' ? 'bg-blue-500' : 'bg-slate-700'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{phase.name}</span>
                        {phase.status === 'current' && (
                          <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">In Progress</span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-slate-200">{phase.title}</h4>
                    </div>
                    <button className="bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-white transition-all">
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activePhase === AppPhase.TODO_APP && (
          <TodoDashboard 
            todos={todos} 
            onAdd={addTodo} 
            onUpdate={updateTodo} 
            onDelete={deleteTodo} 
          />
        )}

        {activePhase === AppPhase.CHATBOT && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-bold text-white">AI-Powered Todo Chatbot</h2>
              <p className="text-slate-400">
                Phase III Implementation: Natural language task management using Gemini 3.0 Pro & MCP Protocol tools.
              </p>
            </div>
            <ChatBot 
              todos={todos} 
              messages={chatHistory}
              setMessages={setChatHistory}
              onAdd={addTodo} 
              onUpdate={updateTodo} 
              onDelete={deleteTodo} 
            />
          </div>
        )}

        {activePhase === AppPhase.SPEC_WORKSPACE && (
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">File Explorer</h3>
              <div className="space-y-1">
                {specs.map(spec => (
                  <button 
                    key={spec.name}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all font-mono text-sm"
                  >
                    <i className="fa-regular fa-file-lines text-blue-500"></i>
                    {spec.name}
                  </button>
                ))}
                <div className="pl-6 pt-2 space-y-1">
                  <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2">Folders</div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-mono">
                    <i className="fa-solid fa-folder text-amber-500/50"></i>
                    features/
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-mono">
                    <i className="fa-solid fa-folder text-amber-500/50"></i>
                    api/
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 text-xs font-mono">specs / features / task-crud.md</div>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-sm text-blue-400 whitespace-pre-wrap">
                  {specs[1].content}
                </pre>
              </div>
              <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-4">
                <div className="text-blue-500 text-xl pt-1">
                  <i className="fa-solid fa-circle-info"></i>
                </div>
                <div>
                  <h4 className="text-blue-400 font-bold text-sm">Spec-Driven Rule</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Claude Code is currently monitoring this specification. Any changes saved will trigger a plan regeneration in the speckit.plan file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePhase === AppPhase.ARCHITECTURE && (
          <div className="space-y-12">
             <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Cloud-Native Blueprint</h2>
                <p className="text-slate-400">Phase V Deployment: Distributed Event-Driven Architecture with Kafka and Dapr.</p>
             </div>
             
             <div className="relative p-12 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden min-h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_70%)] opacity-50"></div>
                
                <div className="relative z-10 grid grid-cols-3 gap-x-20 gap-y-12 items-center text-center">
                  <div className="architecture-node bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg">
                    Frontend Service
                  </div>
                  <div className="architecture-node bg-slate-800 text-slate-300 px-6 py-4 rounded-2xl font-bold border border-slate-700">
                    Dapr Sidecar
                  </div>
                  <div className="architecture-node bg-amber-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg">
                    Kafka Cluster
                  </div>
                  
                  <div className="architecture-node bg-purple-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg">
                    AI Chat API
                  </div>
                  <div className="architecture-node bg-slate-800 text-slate-300 px-6 py-4 rounded-2xl font-bold border border-slate-700">
                    Dapr Sidecar
                  </div>
                  <div className="architecture-node bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg">
                    Neon DB
                  </div>
                </div>

                {/* Simulated connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <line x1="33%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4" />
                  <line x1="66%" y1="50%" x2="50%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="4" />
                </svg>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                 <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-server text-blue-500"></i>
                   Dapr Components
                 </h4>
                 <ul className="space-y-3 text-sm text-slate-400">
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                     <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400">pubsub.kafka</code> - Task Events Bus
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                     <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400">state.postgresql</code> - Session Store
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                     <code className="bg-slate-950 px-2 py-0.5 rounded text-blue-400">bindings.cron</code> - Reminder Trigger
                   </li>
                 </ul>
               </div>
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                 <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-microchip text-purple-500"></i>
                   Agent Skills
                 </h4>
                 <ul className="space-y-3 text-sm text-slate-400">
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                     MCP Server: Task CRUD Tools
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                     Sub-Agent: Architectural Validation
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                     Cloud-Native Blueprints Generator
                   </li>
                 </ul>
               </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-xs font-medium">
            © 2025 Panaversity Hackathon II. Built with Spec-Kit Plus & Claude Code.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xl">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xl">
              <i className="fa-brands fa-discord"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-xl">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
