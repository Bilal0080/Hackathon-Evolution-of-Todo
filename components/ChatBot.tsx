
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Todo, Priority, TaskStatus } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatBotProps {
  todos: Todo[];
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onAdd: (todo: Partial<Todo>) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ todos, messages, setMessages, onAdd, onUpdate, onDelete }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user' as any,
        parts: [{ text: m.content }]
      }));

      const response = await getGeminiResponse(input, history);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I processed that request.",
        timestamp: Date.now(),
        toolCalls: response.functionCalls
      };

      // Handle function calls (simulating MCP server execution)
      if (response.functionCalls) {
        response.functionCalls.forEach(call => {
          const args = call.args as any;
          switch (call.name) {
            case 'add_task':
              onAdd({
                title: args.title,
                description: args.description || '',
                priority: (args.priority as Priority) || Priority.MEDIUM,
                category: args.category || 'AI Generated'
              });
              break;
            case 'complete_task':
              onUpdate(args.task_id, { status: TaskStatus.COMPLETED });
              break;
            case 'delete_task':
              onDelete(args.task_id);
              break;
            case 'list_tasks':
              // The assistant usually reports this in its text response
              break;
          }
        });
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please check your API key environment variable.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Todo Assistant</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Gemini Flash 3.0 • MCP Protocol</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
          title="Clear history"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {m.content}
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700/50 flex flex-wrap gap-2">
                  {m.toolCalls.map((tc, idx) => (
                    <span key={idx} className="bg-slate-950 text-[10px] text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-900/30">
                      λ {tc.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell me to 'Add a high priority task for marketing'..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1.5 bottom-1.5 w-9 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg flex items-center justify-center transition-all"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-600 mt-2">
          Powered by Gemini 3.0 Pro Image Preview • Spec-Driven Context
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
