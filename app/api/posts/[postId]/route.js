import { getViewerIdFromRequest, requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { deletePost, getPostDetail } from "@/lib/repositories/post-repository";

export async function GET(request, { params }) {
  try {
    const viewerId = requireViewerId(request);
    const { postId } = await params;
    const post = await getPostDetail(postId, viewerId);
    return Response.json({ post });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const viewerId = getViewerIdFromRequest(request) || requireViewerId(request);
    const { postId } = await params;
    await deletePost(viewerId, postId);
    return Response.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
