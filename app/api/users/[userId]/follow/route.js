import { readJson } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { toggleFollow } from "@/lib/repositories/user-repository";

export async function POST(request, { params }) {
  try {
    const body = await readJson(request);
    const { userId } = await params;
    const result = await toggleFollow(body.viewerId, userId);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
