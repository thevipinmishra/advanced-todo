import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TodosStore {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  removeTodo: (id: string) => void;
  editTodo: (id: string, updates: Partial<Omit<Todo, "id">>, updateModifiedAt?: boolean) => void;
}

export interface Todo {
  id: string;
  title: string;
  addedAt: Date;
  lastModifiedAt?: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

const useTodosStore = create<TodosStore>()(
  devtools(
    persist(
      (set) => ({
        todos: [],
        addTodo: (todo) => {
          set((state) => ({
            todos: [...state.todos, todo],
          }));
        },
        removeTodo: (id) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }));
        },
        editTodo: (id, updates, updateModifiedAt = true) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    ...updates,
                    lastModifiedAt: updateModifiedAt ? new Date() : todo.lastModifiedAt,
                  }
                : todo
            ),
          }));
        },
      }),
      {
        name: "todos",
      }
    )
  )
);

export const useTodos = () => {
  return useTodosStore((state) => state.todos);
};

export const useAddTodo = () => {
  return useTodosStore((state) => state.addTodo);
};

export const useRemoveTodo = () => {
  return useTodosStore((state) => state.removeTodo);
};

export const useEditTodo = () => {
  return useTodosStore((state) => state.editTodo);
};