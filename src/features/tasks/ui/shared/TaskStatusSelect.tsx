import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TaskStatus } from "../../model/types";
import { TASK_STATUS_ENTRIES, TASK_STATUS_PRESENTATION } from "./taskStatus";

interface TaskStatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
}

export function TaskStatusSelect({
  value,
  onChange,
  className,
}: TaskStatusSelectProps) {
  const current = TASK_STATUS_PRESENTATION[value];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`w-fit h-9 px-3 font-semibold border shadow-sm focus:ring-0 focus:outline-none text-sm transition-colors ${current.triggerClassName} ${className ?? ""}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${current.dotClassName}`}
          />
          <SelectValue>{current.label}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent align="start">
        {TASK_STATUS_ENTRIES.map(([status, presentation]) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${presentation.dotClassName}`}
              />
              {presentation.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
