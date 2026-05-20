/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bookmark, Calendar, AlignLeft, X, Save, AlertCircle } from 'lucide-react';
import { Todo, Priority } from '../types';

interface TodoFormProps {
  todo?: Todo | null; // If present, we are editing
  onSave: (data: { title: string; memo: string; dueDate: string; priority: Priority }) => void;
  onCancel: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  todo,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState<string | null>(null);

  // Set default values when editing a Todo
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setMemo(todo.memo || '');
      setDueDate(todo.dueDate || '');
      setPriority(todo.priority);
    } else {
      setTitle('');
      setMemo('');
      setDueDate('');
      setPriority('medium');
    }
    setError(null);
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('할 일 제목은 필수 입력 항목이에요 😥');
      return;
    }
    setError(null);
    onSave({
      title: title.trim(),
      memo: memo.trim(),
      dueDate,
      priority,
    });
  };

  const todayStr = '2026-05-20'; // Reference time

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
      >
        {/* Form Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-sky-50/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">✏️</span>
            <h2 className="text-lg font-display font-semibold text-slate-800">
              {todo ? '할 일 수정하기' : '새로운 할 일 등록'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-150 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main inputs */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[80vh]">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-sm text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              할 일 제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 강아지 사료 사러 가기 🐶"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 text-slate-800 placeholder-slate-400 font-medium focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Note / Memo input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              상세 메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="추가 설명이나 마트 쇼핑 목록 등을 자유롭게 적어 보세요..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 text-slate-700 placeholder-slate-400 text-sm focus:outline-none transition-all"
            />
          </div>

          {/* Due date */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              마감 기한
            </label>
            <input
              type="date"
              value={dueDate}
              min="2026-01-01"
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 text-slate-700 focus:outline-none transition-all"
            />
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setDueDate(todayStr)}
                className="text-xs px-2.5 py-1 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-md transition-all font-medium border border-sky-100"
              >
                오늘
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date('2026-05-20');
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueDate(tomorrow.toISOString().split('T')[0]);
                }}
                className="text-xs px-2.5 py-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-all font-medium border border-indigo-100"
              >
                내일
              </button>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="text-xs px-2.5 py-1 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition-all font-medium"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* Priority Choice Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              우선순위
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { value: 'low', label: '🌱 낮음', activeBg: 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-100' },
                { value: 'medium', label: '⚡ 보통', activeBg: 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-100' },
                { value: 'high', label: '🔥 높음', activeBg: 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-100' }
              ].map((item) => {
                const isActive = priority === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriority(item.value as Priority)}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all text-center ${
                      isActive
                        ? item.activeBg
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 flex gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-semibold text-slate-600 text-sm transition-all focus:outline-none"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 focus:outline-none"
            >
              <Save className="w-4 h-4" />
              <span>저장하기</span>
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
