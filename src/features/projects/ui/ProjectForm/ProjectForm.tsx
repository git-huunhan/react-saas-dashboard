import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useUsers } from "@/features/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  key: z.string().min(2, "Key must be at least 2 characters").max(5),
  description: z.string().optional(),
  status: z.enum(["planning", "active", "completed"] as const),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  memberIds: z.array(z.string()).min(1, "Select at least one member"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  isLoading?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  isLoading,
}: ProjectFormProps) {
  const { users, loading: usersLoading } = useUsers();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      key: initialData?.key || "",
      description: initialData?.description || "",
      status: initialData?.status || "planning",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      memberIds: initialData?.memberIds || [],
    },
  });

  const selectedMembers = watch("memberIds");

  const toggleMember = (userId: string) => {
    const current = new Set(selectedMembers);
    if (current.has(userId)) {
      current.delete(userId);
    } else {
      current.add(userId);
    }
    setValue("memberIds", Array.from(current), { shouldValidate: true });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Project Name *
          </label>
          <Input {...register("name")} placeholder="e.g. Redesign Website" />
          {errors.name && (
            <span className="text-xs text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Project Key *
          </label>
          <Input
            {...register("key")}
            placeholder="e.g. RED"
            style={{ textTransform: "uppercase" }}
          />
          {errors.key && (
            <span className="text-xs text-red-500">{errors.key.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">Description</label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Project details..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Start Date *
          </label>
          <Input type="date" {...register("startDate")} />
          {errors.startDate && (
            <span className="text-xs text-red-500">
              {errors.startDate.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            End Date *
          </label>
          <Input type="date" {...register("endDate")} />
          {errors.endDate && (
            <span className="text-xs text-red-500">
              {errors.endDate.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">Status *</label>
          <select
            {...register("status")}
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-zinc-700">
          Team Members *
        </label>
        {usersLoading ? (
          <p className="text-sm text-zinc-500">Loading users...</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 rounded-md border border-zinc-200 p-3">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user.id)}
                  onChange={() => toggleMember(user.id)}
                  className="rounded border-zinc-300"
                />
                {user.name} <span className="text-zinc-400">({user.role})</span>
              </label>
            ))}
          </div>
        )}
        {errors.memberIds && (
          <span className="text-xs text-red-500">
            {errors.memberIds.message}
          </span>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? "Saving..." : "Save Project"}
      </Button>
    </form>
  );
}
