import type { CreateUserDto, User } from "@/features/users";

import { mockUsers } from "@/features/users/model/mockUsers";

let usersDb = [...mockUsers];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
  await delay(500);

  return usersDb.map((user) => ({ ...user }));
}

export async function createUser(data: CreateUserDto): Promise<User> {
  await delay(500);

  const newUser: User = {
    id: crypto.randomUUID(),
    ...data,
  };

  usersDb.push(newUser);

  return { ...newUser };
}

export async function updateUser(
  id: string,
  data: CreateUserDto,
): Promise<User> {
  await delay(500);

  const index = usersDb.findIndex((user) => user.id === id);

  const updatedUser = {
    ...usersDb[index],
    ...data,
  };

  usersDb[index] = updatedUser;

  return { ...updatedUser };
}

export async function deleteUser(id: string): Promise<void> {
  await delay(500);

  usersDb = usersDb.filter((user) => user.id !== id);
}
