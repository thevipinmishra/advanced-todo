import {  useTodos } from "./store/todosStore";
import { FileDown, PartyPopper } from "lucide-react";
import { compareAsc, compareDesc, formatDate } from "date-fns";
import { useState } from "react";
import {
  RadioGroup,
  RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group";
import { CsvOutput, download, generateCsv, mkConfig } from "export-to-csv";
import TodoForm from "./TodoForm";
import Todo from "./Todo";

function App() {
  const todos = useTodos();
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

  const handleFilterChange = (details: RadioGroupValueChangeDetails) => {
    setFilter(details.value as "all" | "low" | "medium" | "high");
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
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
            <div
              className="flex justify-between items-center gap-5"
              aria-label="Show"
            >
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
              {todos.length > 4 && (
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
            <div className="shadow rounded-xl space-y-[2px]">
              {sortedTodos.map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        )}
        <TodoForm />
      </div>
    </div>
  );
}

export default App;
