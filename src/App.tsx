/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar, 
  Sparkles, 
  ListChecks, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FolderCheck, 
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { Todo, Priority } from './types';
import { Companion, getCompanionState } from './components/Companion';
import { TodoItem } from './components/TodoItem';
import { TodoForm } from './components/TodoForm';
import { CompletedList } from './components/CompletedList';

const LOCAL_STORAGE_KEY = 'toulingo_todos';

const INITIAL_TODOS: Todo[] = [
  {
    id: 'tutorial-1',
    title: '💬 투리(Touri) 콕 찔러보기',
    memo: '화면 우측 하단의 귀여운 투리를 탭하면 여러 가지 친근한 멘트가 튀어나와요! 투리는 저의 활력 메이트랍니다 🐾',
    priority: 'low',
    completed: false,
    createdAt: new Date('2026-05-20T08:00:00Z').toISOString(),
  },
  {
    id: 'tutorial-2',
    title: '⚡ 마감 임박한 핵심 공부 마스터하기 📚',
    memo: '투두 목록을 관리하고 기한이 지나면 투리가 슬퍼하거나 불안해해요! 기한 전에 해결하여 투리를 기쁘게 해볼까요?',
    dueDate: '2026-05-20',
    priority: 'medium',
    completed: false,
    createdAt: new Date('2026-05-20T08:15:00Z').toISOString(),
  },
  {
    id: 'tutorial-3',
    title: '🎒 Toulingo 설치하고 온보딩 완료하기 🎉',
    memo: 'Google Tasks를 완벽히 벤치마킹하여 귀여운 감정을 담은 To-do list 감성 다이어리 앱을 시작했습니다.',
    priority: 'high',
    completed: true,
    createdAt: new Date('2026-05-20T08:30:00Z').toISOString(),
    completedAt: new Date('2026-05-20T09:00:00Z').toISOString(),
  }
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');
  const [allDoneOverlay, setAllDoneOverlay] = useState(false);

  // Load initially
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        setTodos(INITIAL_TODOS);
      }
    } else {
      setTodos(INITIAL_TODOS);
    }
  }, []);

  // Save changes
  const saveTodosToStorage = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTodos));
  };

  // Check if all active tasks are completed to trigger full celebration effect!
  useEffect(() => {
    if (todos.length > 0 && todos.every(t => t.completed)) {
      setAllDoneOverlay(true);
      // Automatically keep the overlay for 4.5 seconds
      const timer = setTimeout(() => {
        setAllDoneOverlay(false);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setAllDoneOverlay(false);
    }
  }, [todos]);

  // Current date strings (Standard: 2026년 5월 20일 수요일)
  const todayStr = '2026-05-20';
  const displayToday = '2026년 5월 20일 수요일';

  // Toggle checklist complete
  const handleToggleComplete = (id: string) => {
    const updated = todos.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    saveTodosToStorage(updated);
  };

  // Initiate form edit
  const handleStartEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  // Delete checklist item
  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter(t => t.id !== id);
    saveTodosToStorage(updated);
  };

  // Clear completed list
  const handleClearAllCompleted = () => {
    if (window.confirm('정말 완료된 목록을 전부 깨끗하게 비울까요? 🤔')) {
      const updated = todos.filter(t => !t.completed);
      saveTodosToStorage(updated);
    }
  };

  // Save new or modified item
  const handleSaveForm = (data: { title: string; memo: string; dueDate: string; priority: Priority }) => {
    if (editingTodo) {
      // Modify
      const updated = todos.map(t => {
        if (t.id === editingTodo.id) {
          return {
            ...t,
            title: data.title,
            memo: data.memo || undefined,
            dueDate: data.dueDate || undefined,
            priority: data.priority,
          };
        }
        return t;
      });
      saveTodosToStorage(updated);
    } else {
      // Create new
      const nextTodo: Todo = {
        id: `todo-${Date.now()}`,
        title: data.title,
        memo: data.memo || undefined,
        dueDate: data.dueDate || undefined,
        priority: data.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      saveTodosToStorage([nextTodo, ...todos]);
    }
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  // Filter lists
  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  // Sorting logics
  const sortTodos = (items: Todo[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      // default: createdAt (latest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const sortedActive = sortTodos(activeTodos);

  // Stats calculation
  const totalCount = todos.length;
  const completedCount = completedTodos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const todayActiveCount = activeTodos.length;

  // Find priority distribution for quick alerts
  const highPriorityCount = activeTodos.filter(t => t.priority === 'high').length;
  const overdueCount = activeTodos.filter(t => t.dueDate && t.dueDate < todayStr).length;

  return (
    <div className="w-full h-screen bg-[#f3f6ff] flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans overflow-hidden select-none relative selection:bg-sky-100 selection:text-sky-800">
      
      {/* Absolute Fullscreen Sparkle Celebrations Overlay when active tasks are 100% done */}
      <AnimatePresence>
        {allDoneOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-45 bg-gradient-to-b from-sky-400/20 to-indigo-400/20 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.6, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-200/50"
            >
              <div className="text-3xl animate-bounce">👑</div>
              <div>
                <h4 className="font-display font-bold text-slate-800 flex items-center gap-1.5">
                  미션 클리어 대성공! <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
                </h4>
                <p className="text-xs text-slate-500 font-medium">오늘 계획한 일들을 100% 해낸 기적이 찾아왔네요!</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container mirroring High Density size limitations */}
      <div className="w-full h-full md:max-w-[1020px] md:max-h-[760px] bg-[#f8faff] md:rounded-[2rem] flex overflow-hidden relative border border-slate-200 shadow-2xl">
        
        {/* LEFT PANEL: Navigation & Progress */}
        <div className="hidden md:flex w-[290px] h-full bg-white border-r border-slate-200/90 p-7 flex-col shrink-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">TL</span>
              toulingo
            </h1>
            <p className="text-slate-400 text-[10px] mt-1.5 uppercase tracking-widest font-semibold italic">Your Emotional Buddy</p>
          </div>

          <div className="space-y-6 flex-grow flex flex-col">
            {/* Left panel stat box */}
            <div className="p-4.5 bg-indigo-50/60 rounded-2xl border border-indigo-100/50">
              <h3 className="text-indigo-800/60 text-[10px] uppercase font-bold mb-3 tracking-wider">Today's Summary</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3.5xl font-black text-indigo-700 leading-none">{completedCount}</span>
                <span className="text-[11px] text-slate-400 font-medium pb-0.5">/ {totalCount} Tasks</span>
              </div>
              <div className="w-full h-2 bg-indigo-200/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-[10px] text-indigo-500/80 mt-3 font-semibold text-center">
                {completionRate === 100 ? 'Fantastic! All Clean 🌟' : 'Keep going, almost there! ✨'}
              </p>
            </div>

            {/* Selection Navigation Sidebar Links */}
            <nav className="space-y-1.5 flex-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all tracking-wide cursor-pointer text-left ${
                  activeTab === 'active'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border border-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                }`}
              >
                <span className="text-sm">📅</span> My Day
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all tracking-wide cursor-pointer text-left ${
                  activeTab === 'completed'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 border border-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                }`}
              >
                <span className="text-sm">✅</span> Completed
              </button>
            </nav>
          </div>

          {/* User badge footer */}
          <div className="mt-auto pt-5 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-sm shadow-inner">
                H
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">hoyako User</p>
                <p className="text-[10px] text-slate-400 font-semibold tracking-tight">Emotional Level: Tier 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Header, Task List */}
        <div className="flex-1 h-full flex flex-col overflow-hidden relative">
          
          {/* Header section with theme styling */}
          <header className="px-5 md:px-9 pt-6 md:pt-8 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white md:bg-transparent border-b md:border-b-0 border-slate-100 shrink-0">
            <div>
              {/* Show brand title only on mobile header */}
              <div className="flex items-center gap-1.5 md:hidden mb-2">
                <span className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center text-white text-[9px] font-bold">TL</span>
                <span className="font-display font-extrabold text-sm text-indigo-600 animate-pulse">toulingo</span>
              </div>
              
              <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {displayToday}
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                {activeTodos.length === 0 
                  ? 'All clean! Enjoy your beautiful peaceful day! 🌸' 
                  : `You have ${activeTodos.length} pending emotional chores! ✨`}
              </p>
            </div>

            {/* Filter and Add block */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {activeTab === 'active' && activeTodos.length > 0 && (
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 px-2.5 rounded-lg shadow-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-[11px] font-bold text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer outline-none hover:text-slate-900"
                  >
                    <option value="createdAt">등록순</option>
                    <option value="dueDate">마감순</option>
                    <option value="priority">우선순위순</option>
                  </select>
                </div>
              )}
              
              <button
                onClick={() => {
                  setEditingTodo(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-755 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-102 transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </header>

          {/* Quick interactive tab bar ONLY on small mobile screens */}
          <div className="flex md:hidden border-b border-slate-100 bg-white px-4 py-2 justify-around shrink-0">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'active'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                  : 'text-slate-400'
              }`}
            >
              할 일 {activeTodos.length}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'completed'
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                  : 'text-slate-400'
              }`}
            >
              완료목록 {completedTodos.length}
            </button>
          </div>

          {/* Scrolling Main Body Task List Container */}
          <main className="flex-1 px-5 md:px-9 overflow-y-auto pb-24 pt-4">
            <AnimatePresence mode="wait">
              {activeTab === 'active' ? (
                <motion.div
                  key="active-list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-3"
                >
                  {sortedActive.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                      <div className="text-4xl mb-3 animate-pulse">🌾</div>
                      <p className="text-sm font-semibold text-slate-500">지금은 등록된 살아있는 할 일이 없어요!</p>
                      <p className="text-xs text-slate-400 max-w-[240px] mx-auto mt-1 leading-relaxed">
                        우측 하단 캐릭터 동생 Touri를 행복하게 만들기 위해 플러스(+) 단추를 눌러 첫 일정을 등록해볼래요?
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedActive.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggleComplete={handleToggleComplete}
                          onEdit={handleStartEdit}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="completed-list"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <CompletedList
                    completedTodos={completedTodos}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTodo}
                    onClearAllCompleted={handleClearAllCompleted}
                    onBackToMain={() => setActiveTab('active')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Quick Input Area on Bottom to match high density look */}
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-6 bg-gradient-to-t from-[#f8faff] via-[#f8faff] to-transparent pointer-events-none flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingTodo(null);
                setIsFormOpen(true);
              }}
              className="pointer-events-auto flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 px-6 rounded-full shadow-lg transition-all cursor-pointer shadow-indigo-100"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>새로운 할 일 등록하기</span>
            </motion.button>
          </div>

        </div>

      </div>

      {/* Embedded Floating Mascot Companion (Touri) */}
      <Companion todos={todos} />

      {/* Interactive To-do Sheet Form modal popup */}
      <AnimatePresence>
        {isFormOpen && (
          <TodoForm
            todo={editingTodo}
            onSave={handleSaveForm}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTodo(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Tiny clean footer copyright absolute or bottom-placed */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono font-medium text-slate-400/90 tracking-wide bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-250/20">
          toulingo © 2026 • Companion Companion Dashboard
        </span>
      </div>

    </div>
  );
}
