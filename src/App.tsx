import { useForm } from "@mantine/form";
import {
  Todo,
  useAddTodo,
  useEditTodo,
  useRemoveTodo,
  useTodos,
} from "./store/todosStore";
import * as Yup from "yup";
import { Switch } from "@ark-ui/react/switch";
import { nanoid } from "nanoid";
import { yupResolver } from "mantine-form-yup-resolver";
import clsx from "clsx";
import { FileDown, PartyPopper, Plus, X } from "lucide-react";
import { formatRelative, compareAsc, compareDesc, formatDate } from "date-fns";
import { Editable } from "@ark-ui/react/editable";
import { useState } from "react";
import {
  RadioGroup,
  RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group";
import { CsvOutput, download, generateCsv, mkConfig } from "export-to-csv";

interface FormValues {
  title: string;
  priority: "low" | "medium" | "high";
}

const todoSchema = Yup.object().shape({
  title: Yup.string().required(),
  priority: Yup.mixed().oneOf(["low", "medium", "high"]).required(),
});

function App() {
  const todos = useTodos();
  const addTodo = useAddTodo();
  const removeTodo = useRemoveTodo();
  const editTodo = useEditTodo();
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const csvConfig = mkConfig({ useKeysAsHeaders: true });
  const csv =
    todos.length > 1
      ? generateCsv(csvConfig)(
          todos.map((todo) => ({
            ...todo,
            addedAt: formatDate(todo.addedAt, "yyyy-MM-dd HH:mm:ss"),
            lastModifiedAt: todo.lastModifiedAt
              ? formatDate(todo.lastModifiedAt, "yyyy-MM-dd HH:mm:ss")
              : undefined,
          }))
        )
      : null;

  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      priority: "low",
    },
    validate: yupResolver(todoSchema),
  });

  const handleSubmitTodo = (values: FormValues) => {
    const todo: Todo = {
      id: nanoid(),
      title: values.title,
      addedAt: new Date(),
      priority: values.priority,
      completed: false,
    };

    addTodo(todo);
    form.reset();
  };

  const handleFilterChange = (details: RadioGroupValueChangeDetails) => {
    setFilter(details.value as "all" | "low" | "medium" | "high");
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  const handleRemoveTodo = (id: string) => {
    removeTodo(id);
    const remainingTodos = filteredTodos.filter((todo) => todo.id !== id);
    if (remainingTodos.length === 0 && filter !== "all") {
      setFilter("all");
    }
  };

  const handleToggleComplete = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      editTodo(id, { completed: !todo.completed });
    }
  };

  const filteredTodos =
    filter === "all" ? todos : todos.filter((todo) => todo.priority === filter);

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const dateA = a.lastModifiedAt || a.addedAt;
    const dateB = b.lastModifiedAt || b.addedAt;
    return sortOrder === "asc"
      ? compareAsc(dateA, dateB)
      : compareDesc(dateA, dateB);
  });

  return (
    <div>
      <header className="py-5 space-y-6">
        <div className="container flex justify-between items-center gap-6">
          <h2 className="text-lg lg:text-4xl font-extrabold inline-flex items-baseline gap-[1ch] -tracking-wide">
            toodoos{" "}
            {todos.length > 0 && (
              <span className="text-sm lg:text-2xl text-slate-700">
                ({todos.length} item{todos.length > 1 ? "s" : null})
              </span>
            )}
          </h2>

          {todos.length > 0 && (
            <button
              onClick={() => download(csvConfig)(csv as CsvOutput)}
              className="text-xs inline-flex items-center gap-1 font-normal px-2 py-1 rounded-md bg-slate-600 text-white "
            >
              <FileDown className="size-4" /> Export
            </button>
          )}
        </div>
      </header>

      <div className="container space-y-10">
        {todos.length === 0 ? (
          <div className="rounded-md bg-slate-100 p-4 text-center">
            <p className="font-bold text-xl lg:text-2xl inline-flex gap-3">
              Happy times! <PartyPopper className="text-orange-800" />
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-5" aria-label="Show">
              {todos.length > 1 && (
                <RadioGroup.Root
                  className="flex gap-1 text-sm text-slate-700"
                  value={filter}
                  onValueChange={handleFilterChange}
                >
                  <RadioGroup.Item
                    value="all"
                    className="inline-flex justify-center gap-1 items-center bg-white px-2 py-1 border border-dashed border-slate-300 rounded-md data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-solid"
                  >
                    <RadioGroup.ItemText>all</RadioGroup.ItemText>
                    <RadioGroup.ItemControl />
                    <RadioGroup.ItemHiddenInput />
                  </RadioGroup.Item>

                  {todos.some((todo) => todo.priority === "low") && (
                    <RadioGroup.Item
                      value="low"
                      className="inline-flex justify-center gap-1 items-center bg-white px-2 py-1 border border-dashed border-slate-300 rounded-md data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-solid"
                    >
                      <RadioGroup.ItemText>low</RadioGroup.ItemText>
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemHiddenInput />
                    </RadioGroup.Item>
                  )}

                  {todos.some((todo) => todo.priority === "medium") && (
                    <RadioGroup.Item
                      value="medium"
                      className="inline-flex justify-center gap-1 items-center bg-white px-2 py-1 border border-dashed border-slate-300 rounded-md data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-solid"
                    >
                      <RadioGroup.ItemText>medium</RadioGroup.ItemText>
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemHiddenInput />
                    </RadioGroup.Item>
                  )}

                  {todos.some((todo) => todo.priority === "high") && (
                    <RadioGroup.Item
                      value="high"
                      className="inline-flex justify-center gap-1 items-center bg-white px-2 py-1 border border-dashed border-slate-300 rounded-md data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-solid"
                    >
                      <RadioGroup.ItemText>high</RadioGroup.ItemText>
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemHiddenInput />
                    </RadioGroup.Item>
                  )}
                </RadioGroup.Root>
              )}
              {todos.length > 1 && (
                <div className="flex gap-2 items-center text-sm">
                  <select
                    id="sortOrder"
                    aria-label="Sort order"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="text-xs font-medium accent-slate-600 p-1 rounded-md border border-slate-200"
                  >
                    <option value="asc">Sort by ascending</option>
                    <option value="desc">Sort by descending</option>
                  </select>
                </div>
              )}
            </div>
            <div className="shadow rounded-xl">
              {sortedTodos.map((todo) => (
                <div
                  key={todo.id}
                  data-priority={todo.priority}
                  className={clsx(
                    todo.priority === "low"
                      ? "bg-yellow-50"
                      : todo.priority === "medium"
                      ? "bg-orange-200"
                      : "bg-red-100",
                    "p-6 relative group first:rounded-t-xl transition-all  last:rounded-b-xl space-y-1 border-l-4", todo.completed ? "border-green-500" : "border-transparent"
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
                        last modified{" "}
                        {formatRelative(todo.lastModifiedAt, new Date())}
                      </span>
                    ) : (
                      <span>{formatRelative(todo.addedAt, new Date())}</span>
                    )}
                  </p>
                  <Editable.Root
                    value={todo.title}
                    disabled={todo.completed}
                    onValueChange={(details) =>
                      editTodo(todo.id, { title: details.value })
                    }
                    placeholder="Placeholder"
                    activationMode="dblclick"
                  >
                    <Editable.Area>
                      <Editable.Input className="font-semibold text-lg w-full" />
                      <Editable.Preview className="font-extrabold text-xl lg:text-2xl" />
                    </Editable.Area>
                  </Editable.Root>
                  <Switch.Root
                    className="inline-flex items-center gap-2"
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo.id)}
                  >
                    <Switch.Control className="bg-slate-200 data-[state=checked]:bg-slate-950 transition-colors p-[2px] w-6 h-4 rounded-sm">
                      <Switch.Thumb
                        className={clsx(
                          "size-3 block rounded-sm bg-slate-400 data-[state=checked]:bg-white data-[state=checked]:translate-x-2 transition-all "
                        )}
                      />
                    </Switch.Control>
                    <Switch.Label className="text-xs">{todo.completed ? 'Completed' : 'Mark as completed'}</Switch.Label>
                    <Switch.HiddenInput />
                  </Switch.Root>

                  <button
                    onClick={() => handleRemoveTodo(todo.id)}
                    className="size-8 flex justify-center text-slate-700 items-center absolute right-2 top-2 rounded-full hover:bg-gray-300/20 backdrop-blur-sm transition-colors duration-200"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form
          className="space-y-4 bg-white p-4 rounded-md shadow"
          onSubmit={form.onSubmit((values) =>
            handleSubmitTodo(values as FormValues)
          )}
        >
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="title" className="text-xs font-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Add a todo"
              className="text-sm font-medium px-3 placeholder:text-slate-400 py-2 rounded-md border border-slate-200"
              {...form.getInputProps("title")}
            />
            {form.errors?.title ? (
              <p className="text-sm text-red-500 font-medium">
                {form.errors.title}
              </p>
            ) : null}
          </fieldset>
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="priority" className="text-xs font-semibold">
              Priority
            </label>
            <select
              className="text-sm font-medium px-3 py-2 rounded-md border border-slate-200"
              id="priority"
              name="priority"
              {...form.getInputProps("priority")}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {form.errors?.priority ? (
              <p className="text-sm text-red-500 font-medium">
                {form.errors.priority}
              </p>
            ) : null}
          </fieldset>
          <button
            type="submit"
            className="text-base inline-flex justify-center items-center gap-2 font-medium px-3 py-2.5 rounded-md bg-slate-800 text-white w-full"
          >
            Add <Plus className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
