import { getViewerIdFromRequest, readJson, requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { getProfile, updateProfile } from "@/lib/repositories/user-repository";

export async function GET(request, { params }) {
  try {
    const viewerId = getViewerIdFromRequest(request) || requireViewerId(request);
    const { userId } = await params;
    const profile = await getProfile(userId, viewerId);
    return Response.json({ profile });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const viewerId = requireViewerId(request);
    const body = await readJson(request);
    const { userId } = await params;
    const user = await updateProfile({
      viewerId,
      userId,
      username: body.username,
      bio: body.bio,
      avatar: body.avatar,
    });
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
