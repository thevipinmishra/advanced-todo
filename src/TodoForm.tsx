
import { useForm } from "@mantine/form";
import * as Yup from "yup";
import { yupResolver } from "mantine-form-yup-resolver";
import { Plus } from "lucide-react";

interface FormValues {
  title: string;
  priority: "low" | "medium" | "high";
}

const todoSchema = Yup.object().shape({
  title: Yup.string().required(),
  priority: Yup.mixed().oneOf(["low", "medium", "high"]).required(),
});

interface TodoFormProps {
  onSubmit: (values: FormValues) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      priority: "low",
    },
    validate: yupResolver(todoSchema),
  });

  return (
    <form
      className="space-y-4 bg-white p-4 rounded-md shadow"
      onSubmit={form.onSubmit((values) => onSubmit(values as FormValues))}
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
  );
};

export default TodoForm;