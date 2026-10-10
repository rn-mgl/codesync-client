import { create, destroy, read, update } from "./permission.config";

/**
 * Permissions required to sync a join-table pivot.
 *
 * Both pivots grant access by mutating rows in `role_permissions` or
 * `user_roles`, so a single verb covers create, update and delete at once.
 * The caller must hold all three verbs on both the role and the permission
 * resource, since the sync diff adds, updates and removes associations.
 */
export const PIVOT_SYNC: readonly string[] = [
  create.role,
  create.permission,
  update.role,
  update.permission,
  destroy.role,
  destroy.permission,
];

/**
 * Single source of truth for every gated action in the app.
 *
 * Each key is a `"<resource>:<action>"` rule and each value is the full set of
 * permissions that must ALL be held to satisfy it (AND semantics). Rules with
 * a single permission are one-element arrays so every rule is handled alike.
 *
 * This table is deliberately the only place a rule is declared: UI components
 * and BFF route handlers both call `canAccess`, so a gate cannot drift between
 * what the interface hides and what the route enforces.
 */
export const ACCESS_RULES = {
  "problem:create": [create.problem],
  "problem:read": [read.problem],
  "problem:update": [update.problem],
  "problem:destroy": [destroy.problem],

  "topic:create": [create.topic],
  "topic:read": [read.topic],
  "topic:update": [update.topic],
  "topic:destroy": [destroy.topic],

  "hint:create": [create.hint],
  "hint:read": [read.hint],
  "hint:update": [update.hint],
  "hint:destroy": [destroy.hint],

  "test-case:create": [create["test-case"]],
  "test-case:read": [read["test-case"]],
  "test-case:update": [update["test-case"]],
  "test-case:destroy": [destroy["test-case"]],

  "achievement:create": [create.achievement],
  "achievement:read": [read.achievement],
  "achievement:update": [update.achievement],
  "achievement:destroy": [destroy.achievement],

  "queue:create": [create.queue],
  "queue:read": [read.queue],
  "queue:update": [update.queue],
  "queue:destroy": [destroy.queue],

  "role:create": [create.role],
  "role:read": [read.role],
  "role:update": [update.role],
  "role:destroy": [destroy.role],

  "permission:create": [create.permission],
  "permission:read": [read.permission],
  "permission:update": [update.permission],
  "permission:destroy": [destroy.permission],

  "role-permission:read": [read.role, read.permission],
  "role-permission:sync": PIVOT_SYNC,

  "user-role:read": [read.role, read.permission],
  "user-role:sync": PIVOT_SYNC,
} as const;

export type AccessRule = keyof typeof ACCESS_RULES;

/**
 * Narrows an arbitrary string to a known rule key.
 *
 * Used to validate resource/action values that arrive at runtime, such as a
 * record type supplied in a request body.
 */
export const isAccessRule = (value: string): value is AccessRule =>
  Object.hasOwn(ACCESS_RULES, value);

/**
 * Reads a rule's requirements as a single widened type.
 *
 * Without this the index expression yields a union of distinct readonly tuple
 * types, which TypeScript will not let us call `.filter()` on. Widening first
 * keeps the lookup and its return type independent of `as const`.
 */
const requirementsFor = (rule: AccessRule): readonly string[] =>
  ACCESS_RULES[rule];

/**
 * Returns the permissions from a rule that the user does not hold.
 *
 * Callers that build an error message use the first entry to report the
 * specific permission that was missing rather than a generic denial.
 */
export const getMissingPermissions = (
  permissions: string[],
  rule: AccessRule,
): string[] =>
  requirementsFor(rule).filter((required) => !permissions.includes(required));

/**
 * Reports whether the user satisfies a rule.
 *
 * Use this for gating UI and BFF routes alike. It is not a security boundary on
 * its own: the permission list originates from the session at login, so it
 * reflects what the user held when they signed in.
 */
export const canAccess = (permissions: string[], rule: AccessRule): boolean =>
  getMissingPermissions(permissions, rule).length === 0;

/**
 * Resolves a rule from a resource and action supplied at runtime.
 *
 * The pair is joined into a rule key and validated first, so an unrecognised
 * value is denied rather than treated as an undefined rule. Fail-closed by
 * design: garbage input loses access instead of bypassing the check.
 */
export const canAccessAction = (
  permissions: string[],
  resource: string,
  action: string,
): boolean => {
  const rule = `${resource}:${action}`;

  return isAccessRule(rule) && canAccess(permissions, rule);
};
