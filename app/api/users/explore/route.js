import { getViewerIdFromRequest } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { getExploreUsers } from "@/lib/repositories/user-repository";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const viewerId = getViewerIdFromRequest(request);
    const searchTerm = url.searchParams.get("search") || "";
    const users = await getExploreUsers({ viewerId, searchTerm });
    return Response.json({ users });
  } catch (error) {
    return toErrorResponse(error);
  }
}
