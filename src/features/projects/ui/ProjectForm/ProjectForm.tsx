import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useUsers } from "@/features/users";

import "./ProjectForm.css";

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
    <form className="project-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <label>Project Name *</label>
          <input {...register("name")} placeholder="e.g. Redesign Website" />
          {errors.name && (
            <span className="error-text">{errors.name.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Project Key *</label>
          <input
            {...register("key")}
            placeholder="e.g. RED"
            style={{ textTransform: "uppercase" }}
          />
          {errors.key && (
            <span className="error-text">{errors.key.message}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Project details..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date *</label>
          <input type="date" {...register("startDate")} />
          {errors.startDate && (
            <span className="error-text">{errors.startDate.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>End Date *</label>
          <input type="date" {...register("endDate")} />
          {errors.endDate && (
            <span className="error-text">{errors.endDate.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Status *</label>
          <select {...register("status")}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Team Members *</label>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : (
          <div className="member-selection">
            {users.map((user) => (
              <label key={user.id} className="member-checkbox">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user.id)}
                  onChange={() => toggleMember(user.id)}
                />
                {user.name}{" "}
                <span style={{ color: "#6b7280" }}>({user.role})</span>
              </label>
            ))}
          </div>
        )}
        {errors.memberIds && (
          <span className="error-text">{errors.memberIds.message}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Project"}
        </button>
      </div>
    </form>
  );
}
