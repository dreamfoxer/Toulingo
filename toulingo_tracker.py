# -*- coding: utf-8 -*-
"""
@license
SPDX-License-Identifier: Apache-2.0
Toulingo: Google Tasks-inspired To-do List Tracker with Emotional Companion Character.
Written in Python for your local execution.
"""

import json
import datetime
from typing import List, Dict, Any, Tuple

class Priority:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TouliEmotion:
    ECSTATIC = "ecstatic"
    HAPPY = "happy"
    NEUTRAL = "neutral"
    WORRIED = "worried"
    SAD = "sad"
    TIRED = "tired"

class Todo:
    def __init__(self, id_str: str, title: str, memo: str = "", due_date: str = "", priority: str = Priority.MEDIUM, completed: bool = False):
        self.id = id_str
        self.title = title
        self.memo = memo
        self.due_date = due_date # Format: YYYY-MM-DD
        self.priority = priority
        self.completed = completed
        self.created_at = datetime.datetime.now().isoformat()
        self.completed_at = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "memo": self.memo,
            "due_date": self.due_date,
            "priority": self.priority,
            "completed": self.completed,
            "created_at": self.created_at,
            "completed_at": self.completed_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Todo':
        todo = cls(
            id_str=data["id"],
            title=data["title"],
            memo=data.get("memo", ""),
            due_date=data.get("due_date", ""),
            priority=data.get("priority", Priority.MEDIUM),
            completed=data.get("completed", False)
        )
        todo.created_at = data.get("created_at", todo.created_at)
        todo.completed_at = data.get("completed_at")
        return todo


class ToulingoCompanion:
    def __init__(self, level: int = 12):
        self.name = "Touli (투리)"
        self.level = level

    def get_companion_state(self, todos: List[Todo]) -> Tuple[str, str, str]:
        """
        Calculates Touri's emotion and state based on the current context.
        Returns: (Emotion, Message, Facial Expression)
        """
        active_todos = [t for t in todos if not t.completed]
        completed_todos = [t for t in todos if t.completed]
        total_count = len(todos)

        if total_count == 0:
            return (
                TouliEmotion.NEUTRAL,
                "반가워! 오늘 할 일을 입력해서 하루를 멋지게 리드해볼래? 🐾",
                "😊"
            )

        completion_rate = int((len(completed_todos) / total_count) * 100)
        
        # Reference date set to 2026-05-20 to match current context
        today_str = "2026-05-20"

        # Filters
        overdue_todos = [t for t in active_todos if t.due_date and t.due_date < today_str]
        urgent_todos = [t for t in active_todos if t.due_date == today_str]

        # 1. Ecstatic State (100% Accomplished)
        if completion_rate == 100:
            return (
                TouliEmotion.ECSTATIC,
                "와아! 오늘의 할 일을 모두 끝마쳤어! 정말 영리하고 부지런해! 🎉🤩",
                "🌟🤩🌟"
              )

        # 2. Sad State: Overdue tasks exist
        if len(overdue_todos) > 0:
            return (
                TouliEmotion.SAD,
                f"기한이 밀려버린 일이 {len(overdue_todos)}개나 있어... 훌쩍, 지금이라도 얼른 끝마쳐 볼까? 🥺",
                "😥💦"
            )

        # 3. Tired/Burnt out: High Pending tasks load
        if len(active_todos) >= 5 and completion_rate <= 20:
            return (
                TouliEmotion.TIRED,
                "휴우... 해야 할 일 상자가 너무 많아서 조금 어지러워 🌀 차근차근 나누어 보자!",
                "😩💤"
            )

        # 4. Worried state: Urgent tasks due today
        if len(urgent_todos) > 0:
            return (
                TouliEmotion.WORRIED,
                "쿵쾅쿵쾅! 오늘까지 꼭 끝내야 하는 중요한 마감이 있어! 힘내보자! 🔥",
                "😰❗"
            )

        # 5. Happy state: Great progress rates
        if completion_rate >= 60:
            return (
                TouliEmotion.HAPPY,
                "엄청 잘하고 있어! 고지가 눈앞이야, 파이팅! 👍🎈",
                "🥰🎵"
            )

        # 6. Default Neutral state
        return (
            TouliEmotion.NEUTRAL,
            "나는 늘 이곳에서 널 조용히 믿고 응원하고 있어. 천천히 하나씩 가보자 🌱",
            "🙂✨"
        )


class ToulingoApp:
    def __init__(self, filename: str = "todos.json"):
        self.filename = filename
        self.todos: List[Todo] = []
        self.companion = ToulingoCompanion(level=12)
        self.load_todos()

    def load_todos(self):
        try:
            with open(self.filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.todos = [Todo.from_dict(item) for item in data]
        except (FileNotFoundError, json.JSONDecodeError):
            # Seed default tasks to matching tutorial style
            self.todos = [
                Todo("1", "💬 투리(Touri) 세밀하게 관리하기", "귀여운 마스코트 상태 체크", Priority.LOW, False),
                Todo("2", "📚 파이썬으로 가볍고 강력한 알고리즘 고도화하기", "2026-05-20 날짜 마감 과제 실행", Priority.HIGH, False),
                Todo("3", "🎉 toulingo 에 완벽 온보딩하기", "성공적인 기획 및 실행", Priority.MEDIUM, True)
            ]
            self.save_todos()

    def save_todos(self):
        with open(self.filename, 'w', encoding='utf-8') as f:
            json.dump([t.to_dict() for t in self.todos], f, ensure_ascii=False, indent=2)

    def add_todo(self, title: str, memo: str = "", due_date: str = "", priority: str = Priority.MEDIUM):
        todo_id = str(int(datetime.datetime.now().timestamp()))
        new_todo = Todo(todo_id, title, memo, due_date, priority)
        self.todos.append(new_todo)
        self.save_todos()
        print(f"✔️ 새 할 일이 성공적으로 등록되었습니다: [{title}]")

    def toggle_todo(self, todo_id: str):
        for t in self.todos:
            if t.id == todo_id:
                t.completed = not t.completed
                t.completed_at = datetime.datetime.now().isoformat() if t.completed else None
                self.save_todos()
                print(f"🔄 [{t.title}] 상태가 변경되었습니다. (완료 여부: {t.completed})")
                return
        print("❌ 일치하는 할 일을 찾지 못했습니다.")

    def run_cli(self):
        """Interactive Terminal Companion Utility"""
        while True:
            # Calculate and rendering mascot status
            emotion, msg, face = self.companion.get_companion_state(self.todos)
            
            print("\n" + "="*50)
            print(f"       🎨 TOULINGO PORTABLE DASHBOARD (Lvl {self.companion.level})")
            print("="*50)
            print(f"  Character Face: {face}  [{emotion.upper()}]")
            print(f"  Dialogue: \"{msg}\"")
            print("-"*50)
            
            # Print Todo items
            print("  [할 일 목록 (To-do List)]")
            for t in self.todos:
                status_box = "[✓]" if t.completed else "[ ]"
                due_badge = f" (마감: {t.due_date})" if t.due_date else ""
                priority_badge = f" [{t.priority.upper()}]"
                print(f"  {status_box} {t.id}. {t.title}{due_badge}{priority_badge}")
                if t.memo:
                    print(f"      - {t.memo}")
            print("-"*50)
            print("  1: 할 일 추가 | 2: 할 일 완료체크/해제 | 3: 종료")
            menu = input("  선택할 메뉴 번호 입력: ").strip()

            if menu == "1":
                title = input("  할 일 제목*: ").strip()
                if not title:
                    print("  제목은 공백일 수 없습니다.")
                    continue
                memo = input("  메모 (선택): ").strip()
                due = input("  마감일 (예: 2026-05-20) (선택): ").strip()
                print("  우선순위 (1: 낮음 | 2: 보통 | 3: 높음)")
                idx = input("  선택: ").strip()
                prio = Priority.MEDIUM
                if idx == "1": prio = Priority.LOW
                elif idx == "3": prio = Priority.HIGH
                self.add_todo(title, memo, due, prio)
            elif menu == "2":
                tid = input("  완료 토글할 일의 ID 번호 입력: ").strip()
                self.toggle_todo(tid)
            elif menu == "3":
                print("👋 Toulingo Python Companion 에 작별을 고합니다. 내일도 화이팅!")
                break
            else:
                print("🤔 유효하지 않은 선택입니다. 다시 입력해주세요.")

if __name__ == "__main__":
    app = ToulingoApp()
    # To run CLI locally, simply execute: python toulingo_tracker.py
    # For now, it compiles with no exceptions.
    print("Toulingo Python companion module is ready!")
