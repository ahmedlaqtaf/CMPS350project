import { readJson, requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { createPost } from "@/lib/repositories/post-repository";

export async function POST(request) {
  try {
    const viewerId = requireViewerId(request);
    const body = await readJson(request);
    const post = await createPost(viewerId, body.content);
    return Response.json({ post }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
