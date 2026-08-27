import { roleById } from "@/data/roles";
import { peopleById } from "@/data/people";
import type { RoleId } from "@/data/types";

export const ROLE_IDS: RoleId[] = [
  "hq_admin",
  "regional_supervisor",
  "fm_supervisor",
  "imam",
  "muezzin",
  "caretaker",
  "fm_technician",
];

export function isRoleId(value: string | undefined): value is RoleId {
  return !!value && (ROLE_IDS as string[]).includes(value);
}

export function sessionForRole(role: RoleId) {
  const card = roleById[role];
  const person = peopleById[card.person_id]!;
  return { role: card, person };
}

export function routeForRole(role: RoleId): string {
  const device = roleById[role].device;
  return device === "laptop" ? "/laptop" : device === "ipad" ? "/board" : "/phone";
}
