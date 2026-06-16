import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account information.
        </p>
      </div>

      <div className="flex items-center gap-5 p-5 bg-card border border-border rounded-xl">
        <Avatar className="h-16 w-16 border-2 border-primary/30">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}&backgroundColor=10b981&textColor=ffffff&backgroundType=solid`}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground text-lg">{user?.name}</p>
          <Badge
            variant="secondary"
            className="capitalize mt-1 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {user?.role}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <div className="p-5 bg-card border border-border rounded-xl space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Display Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <Input value={user?.role ?? ""} disabled className="capitalize" />
              <p className="text-xs text-muted-foreground">
                Role is assigned by the system.
              </p>
            </div>
            <Button onClick={handleSave} className="w-full">
              {saved ? "✓ Saved!" : "Save Changes"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <div className="p-5 bg-card border border-border rounded-xl space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Current Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                New Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" className="w-full" disabled>
              Update Password{" "}
              <span className="ml-2 text-xs text-muted-foreground">
                (coming soon)
              </span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
