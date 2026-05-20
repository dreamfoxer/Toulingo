/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Smile, HelpCircle, Heart, Flame } from 'lucide-react';
import { Todo, CompanionEmotion, CompanionState } from '../types';

interface CompanionProps {
  todos: Todo[];
  onInteract?: () => void;
}

export function getCompanionState(todos: Todo[]): CompanionState {
  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);
  const totalCount = todos.length;

  if (totalCount === 0) {
    return {
      emotion: 'neutral',
      message: '반가워! 할 일을 입력해서 오늘 하루를 멋지게 채워볼래? ✏️',
      expressionCode: '😊'
    };
  }

  const completionRate = Math.round((completedTodos.length / totalCount) * 100);

  // Parse current date based on standard local ISO
  const todayStr = '2026-05-20'; // Reference time provided: 2026-05-20

  // Check for overdue (due date before today & not completed)
  const overdueTodos = activeTodos.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate < todayStr;
  });

  // Check for urgent (due today and not completed)
  const urgentTodos = activeTodos.filter(t => {
    return t.dueDate === todayStr;
  });

  // 1. Ecstatic state: 100% completed
  if (completionRate === 100) {
    return {
      emotion: 'ecstatic',
      message: '와아! 모든 일을 전부 완료했어! 너 최고야! 🎉✨',
      expressionCode: '🌟🤩🌟'
    };
  }

  // 2. Sad state: Has overdue tasks
  if (overdueTodos.length > 0) {
    return {
      emotion: 'sad',
      message: `기한이 지난 할 일이 ${overdueTodos.length}개 있어요... 슬프지만 다시 힘내서 끝내볼까요? 🥺☔`,
      expressionCode: '😥💦'
    };
  }

  // 3. Tired/Burnt out: High pending task load with very low progress
  if (activeTodos.length >= 5 && completionRate <= 20) {
    return {
      emotion: 'tired',
      message: '우와... 할 일이 너무 밀려서 조금 숨이 차요 🌀 하나씩 차근차근 해봐요!',
      expressionCode: '😩💤'
    };
  }

  // 4. Worried/Anxious: Has urgent tasks due today
  if (urgentTodos.length > 0) {
    return {
      emotion: 'worried',
      message: `오늘까지 끝내야 하는 중요 일정이 있어요! 초조해하지 말고 힘내봐요! 🔥`,
      expressionCode: '😰❗'
    };
  }

  // 5. Happy state: High completion rate
  if (completionRate >= 60) {
    return {
      emotion: 'happy',
      message: `엄청 잘하고 있어요! 조금만 더 하면 완벽히 끝낼 수 있겠는걸요? 👍🎈`,
      expressionCode: '🥰🎵'
    };
  }

  // 6. Neutral: default
  return {
    emotion: 'neutral',
    message: `차근차근 하나씩 마무리해 봐요. 나는 늘 여기서 응원하고 있어! 🌱`,
    expressionCode: '🙂✨'
  };
}

export const Companion: React.FC<CompanionProps> = ({ todos }) => {
  const [state, setState] = useState<CompanionState>({
    emotion: 'neutral',
    message: '안녕! 나는 너의 할 일 메이트 투리야! 🐾',
    expressionCode: '😊'
  });
  const [clickCount, setClickCount] = useState(0);
  const [temporaryMessage, setTemporaryMessage] = useState<string | null>(null);

  useEffect(() => {
    const computed = getCompanionState(todos);
    setState(computed);
  }, [todos]);

  // Handle clicking Touri for funny interactive responses!
  const handleInteraction = () => {
    setClickCount(prev => prev + 1);
    
    // Choose a custom interactive message depending on Touri's emotion state
    const dialogs: Record<CompanionEmotion, string[]> = {
      ecstatic: [
        "꺄하핫! 오늘 기분 정말 날아갈 것 같아! 🌈",
        "너랑 있으면 뭐든 다 잘 되는 구나! ✨",
        "우린 최강의 콤비인 게 틀림없어! 🤜🤛",
        "너의 실행력에 100만 점 드립니다! 🥇"
      ],
      happy: [
        "콕 찌르니까 꼬리가 살랑살랑 흔들려요! 🐶",
        "네가 힘내서 일할 때 나도 기분이 좋아! 💖",
        "지금처럼만 계속해 볼까요? 화이팅!",
        "오늘 하루 끝엔 멋진 보상이 기다릴지도? 🍰"
      ],
      neutral: [
        "나를 부르셨나요? 헤헤 👀",
        "지루할 때는 가볍게 기지개를 한 번 켜봐요! 🧘",
        "조급해하지 않고 천천히 하는 것이 지름길이에요 😊",
        "할 일이 너무 복잡하다면 작게 쪼개서 적어봐요!"
      ],
      worried: [
        "앗 깜짝이야! 조금 서둘러야 할 일이 보여서 바들바들 떨고 있어요 🥺",
        "오늘 마감인 일은 중요해요! 먼저 하면 어떨까요? ✨",
        "너무 부담 갖지 말구 심호흡 한 번 하구 시작해봐요!",
        "나는 무조건 네 편이니까 자신감을 가져요!"
      ],
      sad: [
        "훌쩍... 기한이 지난 일을 보면 자꾸 눈물이 나려 그래요 💧",
        "과거는 흘러갔으니 지금 이 순간에 집중해봐요!",
        "조금 늦더라도 끝마치는 게 중요하답니다 🧩",
        "내가 달래줄 테니까 힘 풀고 다시 시작해요!"
      ],
      tired: [
        "꼬르륵... 배가 고픈 걸까요 지친 걸까요? 🌀",
        "잠시 5분만 눈을 붙이거나 달콤한 걸 섭취해 보아요 🍫",
        "할 일 상자를 하나 완료하면 기운이 번쩍 날 것 같아요!",
        "같이 으쌰으쌰 스트레칭을 해볼까요? 흐읍~"
      ]
    };

    const list = dialogs[state.emotion];
    const index = Math.floor(Math.random() * list.length);
    setTemporaryMessage(list[index]);

    // Clear temporary interactive text after 4.5 seconds
    const timer = setTimeout(() => {
      setTemporaryMessage(null);
    }, 4500);

    return () => clearTimeout(timer);
  };

  const displayedMessage = temporaryMessage || state.message;

  // Let's configure custom mascot styles based on state
  const getAvatarStyles = () => {
    switch (state.emotion) {
      case 'ecstatic':
        return {
          bgColor: 'bg-amber-100 border-amber-300',
          shadowColor: 'shadow-amber-200',
          facialColor: 'text-amber-600',
          animation: 'animate-bounce-slow',
          glow: 'ring-4 ring-amber-300 ring-offset-2'
        };
      case 'happy':
        return {
          bgColor: 'bg-emerald-100 border-emerald-300',
          shadowColor: 'shadow-emerald-200',
          facialColor: 'text-emerald-700',
          animation: 'animate-float',
          glow: 'ring-2 ring-emerald-200'
        };
      case 'worried':
        return {
          bgColor: 'bg-orange-100 border-orange-300',
          shadowColor: 'shadow-orange-200',
          facialColor: 'text-orange-700',
          animation: 'animate-pulse-subtle',
          glow: 'ring-1 ring-orange-200'
        };
      case 'sad':
        return {
          bgColor: 'bg-blue-100 border-blue-300',
          shadowColor: 'shadow-blue-200',
          facialColor: 'text-blue-700',
          animation: 'animate-pulse-subtle',
          glow: ''
        };
      case 'tired':
        return {
          bgColor: 'bg-slate-200 border-slate-300',
          shadowColor: 'shadow-slate-300',
          facialColor: 'text-slate-600',
          animation: '',
          glow: ''
        };
      case 'neutral':
      default:
        return {
          bgColor: 'bg-sky-50 border-sky-200',
          shadowColor: 'shadow-sky-100',
          facialColor: 'text-sky-700',
          animation: 'animate-float',
          glow: 'hover:ring-2 hover:ring-sky-100'
        };
    }
  };

  const avatar = getAvatarStyles();

  return (
    <div id="companion-widget" className="fixed bottom-6 right-6 z-50 flex flex-col items-end max-w-[280px] sm:max-w-[320px]">
      {/* Speech Bubble / Dialogue */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayedMessage}
          initial={{ opacity: 0, y: 15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="mb-3 bg-white text-slate-700 border border-slate-100 rounded-2xl p-3.5 shadow-lg relative text-sm leading-relaxed font-medium"
        >
          {/* Sparkly particles on high achievements */}
          {state.emotion === 'ecstatic' && (
            <div className="absolute -top-2.5 -left-2.5">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
            </div>
          )}
          {state.emotion === 'sad' && (
            <div className="absolute -top-1.5 -right-1 text-slate-400 text-xs">💧</div>
          )}

          <p>{displayedMessage}</p>

          {/* Speech Bubble Arrow */}
          <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* Main Companion Character Body */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: state.emotion === 'ecstatic' ? 3 : -2 }}
        whileTap={{ scale: 0.92, rotate: 5 }}
        onClick={handleInteraction}
        className={`cursor-pointer w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 ${avatar.bgColor} ${avatar.shadowColor} ${avatar.glow} ${avatar.animation} shadow-xl flex flex-col items-center justify-center relative transition-colors duration-500`}
      >
        {/* Dynamic Character Face */}
        <div className="flex flex-col items-center justify-center select-none">
          {/* Eyes & Mouth configurations */}
          {state.emotion === 'ecstatic' && (
            <div className="text-center">
              <div className="flex justify-center gap-2 mb-1">
                <span className="text-lg font-bold">✨</span>
                <span className="text-lg font-bold">✨</span>
              </div>
              <div className="w-5 h-3 bg-red-400 rounded-b-full mx-auto" />
            </div>
          )}

          {state.emotion === 'happy' && (
            <div className="text-center">
              <div className="flex justify-center gap-2.5 mb-1.5">
                <span className="text-base font-bold leading-none">^</span>
                <span className="text-base font-bold leading-none">^</span>
              </div>
              <div className="w-4.5 h-2 bg-pink-400 rounded-b-full mx-auto" />
            </div>
          )}

          {state.emotion === 'neutral' && (
            <div className="text-center">
              <div className="flex justify-center gap-3.5 mb-1.5">
                <div className="w-2 h-2 bg-slate-700 rounded-full" />
                <div className="w-2 h-2 bg-slate-700 rounded-full" />
              </div>
              <div className="w-3.5 h-1 border-b border-slate-700 rounded-full mx-auto" />
            </div>
          )}

          {state.emotion === 'worried' && (
            <div className="text-center relative">
              {/* Sweat Drop */}
              <div className="absolute -left-3.5 top-0 text-sky-400 text-xs animate-bounce">💧</div>
              <div className="flex justify-center gap-3.5 mb-2">
                <span className="text-xs font-semibold leading-none text-slate-800">●</span>
                <span className="text-xs font-semibold leading-none text-slate-800">●</span>
              </div>
              <div className="w-3.5 h-1.5 bg-orange-300 rounded-full mx-auto" />
            </div>
          )}

          {state.emotion === 'sad' && (
            <div className="text-center relative">
              {/* Tear drop */}
              <div className="absolute -right-3.5 top-1.5 text-sky-500/80 text-[10px] animate-pulse">💧</div>
              <div className="flex justify-center gap-3.5 mb-1.5">
                <span className="text-xs font-bold leading-none">T</span>
                <span className="text-xs font-bold leading-none">T</span>
              </div>
              <div className="w-3.5 h-1.5 border-t-2 border-slate-600 rounded-full mx-auto" />
            </div>
          )}

          {state.emotion === 'tired' && (
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-1.5">
                <span className="text-[10px] font-bold text-slate-500">─</span>
                <span className="text-[10px] font-bold text-slate-500">─</span>
              </div>
              <div className="w-3 h-2 border border-slate-500 rounded-full mx-auto" />
            </div>
          )}
        </div>

        {/* Adorable blush cheeks */}
        {['happy', 'ecstatic', 'neutral'].includes(state.emotion) && (
          <div className="absolute bottom-5 left-3 right-3 flex justify-between px-1 pointer-events-none opacity-60">
            <div className="w-2.5 h-1.5 bg-pink-300 rounded-full blur-[0.5px]" />
            <div className="w-2.5 h-1.5 bg-pink-300 rounded-full blur-[0.5px]" />
          </div>
        )}

        {/* Companion Name Badge or Interaction Indicator */}
        <div className="absolute -bottom-2.5 bg-slate-800 text-white font-display font-semibold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
          {state.emotion === 'ecstatic' ? '🔥 Touli: Lvl 12' : 'Touli: Lvl 12 🐾'}
        </div>
      </motion.div>
    </div>
  );
};
