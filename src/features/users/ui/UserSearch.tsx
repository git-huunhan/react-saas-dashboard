import Input from "@/shared/ui/Input/Input";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <Input
      placeholder="Search users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
