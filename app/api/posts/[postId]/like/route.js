import { readJson } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { toggleLike } from "@/lib/repositories/post-repository";

export async function POST(request, { params }) {
  try {
    const body = await readJson(request);
    const { postId } = await params;
    const result = await toggleLike(body.viewerId, postId);
    return Response.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
