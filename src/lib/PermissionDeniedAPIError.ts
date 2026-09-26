import { StatusCodes } from "http-status-codes";
import APIError from "./APIError";

const VERBS = {
  create: "create",
  read: "view",
  update: "update",
  delete: "delete",
};

const TARGETS = {
  create: (noun: string) => `${/^[aeiou]/i.test(noun) ? "an" : "a"} ${noun}`,
  read: (noun: string) => `${noun}s`,
  update: (noun: string) => `this ${noun}`,
  delete: (noun: string) => `this ${noun}`,
};

class PermissionDeniedError extends APIError {
  constructor(permission: string) {
    super(
      PermissionDeniedError.getMessage(permission),
      StatusCodes.UNAUTHORIZED,
    );
  }

  private static getMessage(permission: string) {
    const [resource, action] = permission.split(":");

    const noun = resource?.replace(/-/g, " ");
    const verb = VERBS[action as keyof typeof VERBS];
    const getTarget = TARGETS[action as keyof typeof TARGETS];

    if (!noun || !verb || !getTarget) {
      return `You do not have permission to perform this action.`;
    }

    return `You do not have permission to ${verb} ${getTarget(noun)}.`;
  }
}

export default PermissionDeniedError;
