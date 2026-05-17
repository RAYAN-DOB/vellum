import type {
  PermissionAction,
  PermissionActor,
  PermissionDecision,
  PermissionResource,
} from "@/types/permissions";

const sensitiveActions: PermissionAction[] = ["download", "admin"];

export function can(
  actor: PermissionActor,
  action: PermissionAction,
  resource: PermissionResource,
) {
  return explainCan(actor, action, resource).allowed;
}

export function explainCan(
  actor: PermissionActor,
  action: PermissionAction,
  resource: PermissionResource,
): PermissionDecision {
  if (actor.role === "admin") {
    return {
      allowed: true,
      reason: "Mock rule: admins can access MVP demo resources.",
    };
  }

  if (
    resource.organizationId &&
    resource.organizationId !== actor.organizationId
  ) {
    return {
      allowed: false,
      reason: "Mock rule: organization boundaries must match.",
    };
  }

  if (resource.isSensitive && sensitiveActions.includes(action)) {
    return {
      allowed: false,
      reason:
        "Mock rule: sensitive file actions require future server-side checks.",
    };
  }

  if (actor.role === "project_manager") {
    return {
      allowed: ["view", "create", "update", "comment", "assign", "review"].includes(
        action,
      ),
      reason: "Mock rule: project managers can coordinate demo work.",
    };
  }

  if (actor.role === "drafter") {
    const isAssigned = Boolean(
      resource.projectId && actor.assignedProjectIds?.includes(resource.projectId),
    );

    return {
      allowed:
        isAssigned && ["view", "comment", "update", "review"].includes(action),
      reason: "Mock rule: drafters only access assigned demo projects.",
    };
  }

  return {
    allowed: ["view", "create", "comment"].includes(action),
    reason: "Mock rule: clients can follow and create their own demo requests.",
  };
}
