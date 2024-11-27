import React, { useState } from "react";
import { Switch } from "@ark-ui/react/switch";
import clsx from "clsx";
import { formatRelative } from "date-fns";
import { Editable } from "@ark-ui/react/editable";
import { Tooltip } from "@ark-ui/react/tooltip";
import { Trash2 } from "lucide-react";
import { useEditTodo, useRemoveTodo } from "./store/todosStore";

interface TodoProps {
  todo: {
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
    completed: boolean;
    addedAt: Date;
    lastModifiedAt?: Date;
  };
}

const Todo: React.FC<TodoProps> = ({ todo }) => {
  const [tempTitle, setTempTitle] = useState(todo.title);
  const editTodo = useEditTodo();
  const removeTodo = useRemoveTodo();

  const handleToggleComplete = () => {
    editTodo(todo.id, { completed: !todo.completed }, false);
  };

  const handleRemoveTodo = () => {
    removeTodo(todo.id);
  };

  return (
    <div
      data-priority={todo.priority}
      className={clsx(
        todo.priority === "low"
          ? "bg-green-100"
          : todo.priority === "medium"
          ? "bg-orange-100"
          : "bg-red-100",
        "p-6 relative group first:rounded-t-xl transition-all last:rounded-b-xl space-y-3 border-l-4",
        todo.completed ? "border-green-500" : "border-transparent"
      )}
    >
      <p
        className={clsx(
          "absolute right-0 bottom-0 text-xs uppercase tracking-widest group-last:rounded-br-[inherit] px-2.5 py-1 rounded-tl-xl text-white",
          todo.priority === "low"
            ? "bg-green-900"
            : todo.priority === "medium"
            ? "bg-orange-900"
            : "bg-red-900"
        )}
      >
        {todo.priority}
      </p>
      <p className="text-xs text-slate-700 uppercase tracking-wider">
        {todo.lastModifiedAt ? (
          <span>
            last modified {formatRelative(todo.lastModifiedAt, new Date())}
          </span>
        ) : (
          <span>{formatRelative(todo.addedAt, new Date())}</span>
        )}
      </p>
      <Editable.Root
        value={tempTitle}
        disabled={todo.completed}
        onValueChange={(details) => setTempTitle(details.value)}
        onValueCommit={(details) => {
          if (details.value !== todo.title) {
            editTodo(todo.id, { title: details.value });
          }
        }}
        placeholder="Placeholder"
        activationMode="dblclick"
      >
        <Editable.Area>
          <Editable.Input className="font-semibold outline-none rounded-sm text-xl w-full" />
          <Editable.Preview
            title="Double click to edit"
            className="font-extrabold text-xl lg:text-2xl"
          />
        </Editable.Area>
      </Editable.Root>
      <Switch.Root
        className="inline-flex items-center gap-2"
        checked={todo.completed}
        onCheckedChange={handleToggleComplete}
      >
        <Switch.Control className="bg-slate-200 data-[state=checked]:bg-slate-950 transition-colors p-[2px] w-6 h-4 rounded-sm">
          <Switch.Thumb
            className={clsx(
              "size-3 block rounded-sm bg-slate-400 data-[state=checked]:bg-white data-[state=checked]:translate-x-2 transition-all "
            )}
          />
        </Switch.Control>
        <Switch.Label className="text-xs">
          {todo.completed ? "Completed" : "Mark as completed"}
        </Switch.Label>
        <Switch.HiddenInput />
      </Switch.Root>

      <Tooltip.Root>
        <Tooltip.Trigger
          onClick={handleRemoveTodo}
          className="size-8 flex justify-center text-slate-700 items-center absolute right-2 top-2 rounded-full hover:bg-gray-300/20 backdrop-blur-sm transition-colors duration-200"
        >
          <Trash2 className="size-4" />
        </Tooltip.Trigger>
        <Tooltip.Positioner className="!mt-0">
          <Tooltip.Content className="p-1 text-sm rounded-md shadow bg-white data-open:animate-in data-open:fade-in data-close:animate-out data-close:fade-out-0">
            <p className="text-xs font-medium">Remove</p>
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </div>
  );
};

export default Todo;
