import { requireViewerId } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { getFeedPosts } from "@/lib/repositories/post-repository";

export async function GET(request) {
  try {
    const viewerId = requireViewerId(request);
    const posts = await getFeedPosts(viewerId);
    return Response.json({ posts });
  } catch (error) {
    return toErrorResponse(error);
  }
}
