/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  memo?: string;
  dueDate?: string; // YYYY-MM-DD format
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export type CompanionEmotion = 'ecstatic' | 'happy' | 'neutral' | 'worried' | 'sad' | 'tired';

export interface CompanionState {
  emotion: CompanionEmotion;
  message: string;
  expressionCode: string; // Dynamic visual feedback
}
