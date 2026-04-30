import { requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { getCurrentUser } from "@/lib/repositories/user-repository";

export async function GET(request) {
  try {
    const viewerId = requireViewerId(request);
    const user = await getCurrentUser(viewerId);
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
