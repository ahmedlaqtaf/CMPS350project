import { readJson } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { addComment } from "@/lib/repositories/post-repository";

export async function POST(request, { params }) {
  try {
    const body = await readJson(request);
    const { postId } = await params;
    const result = await addComment(body.viewerId, postId, body.content);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
