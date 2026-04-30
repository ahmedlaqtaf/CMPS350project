import { requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { getSuggestedUsers } from "@/lib/repositories/user-repository";

export async function GET(request) {
  try {
    const viewerId = requireViewerId(request);
    const users = await getSuggestedUsers(viewerId);
    return Response.json({ users });
  } catch (error) {
    return toErrorResponse(error);
  }
}
