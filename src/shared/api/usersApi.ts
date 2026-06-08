import type { User } from "@/features/users";

import { mockUsers } from "@/features/users/model/mockUsers";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
  await delay(500);

  return mockUsers;
}
