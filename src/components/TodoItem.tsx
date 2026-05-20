/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Trash2, Edit2, AlertCircle, Bookmark, Check } from 'lucide-react';
import { Todo, Priority } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const isOverdue = (): boolean => {
    if (!todo.dueDate || todo.completed) return false;
    const todayStr = '2026-05-20'; // Reference time provided
    return todo.dueDate < todayStr;
  };

  const isDueToday = (): boolean => {
    if (!todo.dueDate || todo.completed) return false;
    const todayStr = '2026-05-20';
    return todo.dueDate === todayStr;
  };

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'high':
        return {
          border: 'border-l-4 border-l-rose-400',
          badgeBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          label: '🔥 높은 우선순위'
        };
      case 'medium':
        return {
          border: 'border-l-4 border-l-amber-400',
          badgeBg: 'bg-amber-50 text-amber-600 border border-amber-100',
          label: '⚡ 중간 우선순위'
        };
      case 'low':
      default:
        return {
          border: 'border-l-4 border-l-sky-400',
          badgeBg: 'bg-sky-50 text-sky-600 border border-sky-100',
          label: '🌱 낮은 우선순위'
        };
    }
  };

  const styles = getPriorityStyle(todo.priority);

  return (
    <motion.div
      id={`todo-item-${todo.id}`}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 hover:shadow-md hover:border-slate-200 transition-all ${styles.border} flex items-start gap-3.5 relative`}
    >
      {/* Custom Romantic/Cute Circular Checkbox */}
      <button
        type="button"
        onClick={() => onToggleComplete(todo.id)}
        className="mt-0.5 relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-350 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-200 transition-all hover:scale-105"
        style={{
          borderColor: todo.completed ? '#10b981' : '#cbd5e1',
          backgroundColor: todo.completed ? '#e6fbf3' : 'transparent',
        }}
      >
        {todo.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          >
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          </motion.div>
        )}
      </button>

      {/* Todo Contents */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={`font-medium text-slate-800 break-all leading-snug transition-all ${
              todo.completed ? 'line-through text-slate-400 font-normal' : ''
            }`}
          >
            {todo.title}
          </h3>

          {!todo.completed && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${styles.badgeBg}`}>
              {styles.label}
            </span>
          )}
        </div>

        {/* Memo / Notes */}
        {todo.memo && (
          <p className={`mt-1.5 text-xs text-slate-500 break-all leading-relaxed whitespace-pre-wrap ${
            todo.completed ? 'opacity-50' : ''
          }`}>
            {todo.memo}
          </p>
        )}

        {/* Extra Footer: Date / Status Tag */}
        {(todo.dueDate || todo.completedAt) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400 font-mono">
            {todo.dueDate && !todo.completed && (
              <span
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md font-sans font-medium ${
                  isOverdue()
                    ? 'text-rose-600 bg-rose-50 border border-rose-100 animate-pulse'
                    : isDueToday()
                    ? 'text-amber-600 bg-amber-50 border border-amber-100'
                    : 'text-slate-500 bg-slate-50 border border-slate-100'
                }`}
              >
                {isOverdue() ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                <span>마감: {todo.dueDate}</span>
                {isOverdue() && <span className="font-semibold text-[10px] ml-0.5">기한 초과!</span>}
                {isDueToday() && <span className="font-semibold text-[10px] ml-0.5">오늘 마감!</span>}
              </span>
            )}

            {todo.completed && todo.completedAt && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-sans font-medium bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/40">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                완료: {new Date(todo.completedAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Action Operations */}
      <div className="flex items-center gap-1 ml-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
          title="수정"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
