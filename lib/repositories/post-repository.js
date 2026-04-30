import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  buildPostCardSelect,
  buildPostDetailSelect,
  mapPostCard,
  mapPostDetail,
} from "@/lib/repositories/mappers";

async function ensureViewer(viewerId) {
  const user = await prisma.user.findUnique({
    where: { id: viewerId },
    select: { id: true },
  });

  if (!user) {
    throw new AppError("Your session has expired. Please sign in again.", 401);
  }
}

async function ensurePost(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });

  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  return post;
}

export async function getFeedPosts(viewerId) {
  await ensureViewer(viewerId);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: viewerId },
        {
          author: {
            followers: {
              some: { followerId: viewerId },
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "desc" },
    select: buildPostCardSelect(viewerId),
  });

  return posts.map((post) => mapPostCard(post, viewerId));
}

export async function getPostDetail(postId, viewerId) {
  await ensureViewer(viewerId);

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: buildPostDetailSelect(viewerId),
  });

  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  return mapPostDetail(post, viewerId);
}

export async function createPost(viewerId, content) {
  await ensureViewer(viewerId);

  const trimmedContent = (content || "").trim();
  if (!trimmedContent) {
    throw new AppError("Write something before posting.");
  }

  if (trimmedContent.length > 280) {
    throw new AppError("Posts must be 280 characters or fewer.");
  }

  const post = await prisma.post.create({
    data: {
      id: `p_${randomUUID().slice(0, 12)}`,
      authorId: viewerId,
      content: trimmedContent,
      createdAt: new Date(),
    },
    select: { id: true },
  });

  return getPostDetail(post.id, viewerId);
}

export async function deletePost(viewerId, postId) {
  await ensureViewer(viewerId);
  const post = await ensurePost(postId);

  if (post.authorId !== viewerId) {
    throw new AppError("You can only delete your own posts.", 403);
  }

  await prisma.post.delete({
    where: { id: postId },
  });
}

export async function toggleLike(viewerId, postId) {
  await ensureViewer(viewerId);
  await ensurePost(postId);

  const existing = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: viewerId,
      },
    },
  });

  if (existing) {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId,
          userId: viewerId,
        },
      },
    });
  } else {
    await prisma.postLike.create({
      data: {
        postId,
        userId: viewerId,
      },
    });
  }

  const likeCount = await prisma.postLike.count({
    where: { postId },
  });

  return {
    liked: !existing,
    likeCount,
  };
}

export async function addComment(viewerId, postId, content) {
  await ensureViewer(viewerId);
  await ensurePost(postId);

  const trimmedContent = (content || "").trim();
  if (!trimmedContent) {
    throw new AppError("Write a comment first.");
  }

  await prisma.comment.create({
    data: {
      id: `c_${randomUUID().slice(0, 12)}`,
      postId,
      authorId: viewerId,
      content: trimmedContent,
      createdAt: new Date(),
    },
  });

  const commentCount = await prisma.comment.count({
    where: { postId },
  });

  return {
    commentCount,
  };
}
