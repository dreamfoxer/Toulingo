/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, Trash2, Sparkles, Smile, ArrowLeft } from 'lucide-react';
import { Todo } from '../types';

interface CompletedListProps {
  completedTodos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAllCompleted: () => void;
  onBackToMain: () => void;
}

export const CompletedList: React.FC<CompletedListProps> = ({
  completedTodos,
  onToggleComplete,
  onDelete,
  onClearAllCompleted,
  onBackToMain,
}) => {
  return (
    <div id="completed-view" className="space-y-4">
      {/* Title & Navigation */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBackToMain}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>메인 리스트로 가기</span>
        </button>

        {completedTodos.length > 0 && (
          <button
            onClick={onClearAllCompleted}
            className="text-xs font-medium text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-500 border border-rose-100 rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>완료 목록 모두 비우기</span>
          </button>
        )}
      </div>

      {/* Completed Header Area */}
      <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100/60 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h2 className="text-base font-display font-bold text-slate-800">
          완료된 소중한 할 일들 ✨
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          차곡차곡 쌓인 완료 표시들은 당신이 오늘 하루를 그만큼 열심히 잘 살았다는 증거입니다!
        </p>
        <div className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 rounded-full">
          총 {completedTodos.length}개 완료 완료!
        </div>
      </div>

      {/* Complete Cards List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {completedTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl p-6"
            >
              <div className="text-3xl mb-2">🌸</div>
              <p className="text-sm font-medium">아직 완료된 할 일이 없어요.</p>
              <p className="text-xs text-slate-400 mt-1">
                오늘 할 일들 중 끝마친 게 있다면 체크박스를 눌러 완료해 보세요! Touri가 기뻐서 날아다닐 거예요!
              </p>
            </motion.div>
          ) : (
            completedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-3 px-4 border border-slate-100 flex items-center justify-between gap-3.5 hover:shadow-sm hover:border-slate-150 transition-all"
              >
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {/* Circular check mark */}
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm text-slate-400 font-normal line-through truncate">
                      {todo.title}
                    </h3>
                    {todo.completedAt && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(todo.completedAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Return or Delete */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleComplete(todo.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-xs flex items-center gap-1"
                    title="미완료 상태로 되돌리기"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">되돌리기</span>
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs"
                    title="기록 영구 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
