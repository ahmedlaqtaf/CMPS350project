import { AppError } from "@/lib/errors";

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function getViewerIdFromRequest(request) {
  return new URL(request.url).searchParams.get("viewerId")?.trim() || null;
}

export function requireViewerId(request) {
  const viewerId = getViewerIdFromRequest(request);
  if (!viewerId) {
    throw new AppError("A signed-in user is required for this action.", 401);
  }
  return viewerId;
}
