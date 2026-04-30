import { prisma } from "@/lib/prisma";

function round(value) {
  return Math.round(value * 10) / 10;
}

function excerpt(text, limit = 110) {
  if (!text) {
    return "";
  }

  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

async function findUsersByIds(ids) {
  if (!ids.length) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });

  const byId = new Map(users.map((user) => [user.id, user]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

export async function getDashboardStats() {
  const now = new Date();
  const last90Days = new Date(now);
  last90Days.setDate(now.getDate() - 90);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    userCount,
    postCount,
    commentCount,
    likeCount,
    followCount,
    newUsersThisMonth,
    mostFollowedUser,
    mostLikedPost,
    mostDiscussedPost,
    activeUsersRaw,
    allTimeTopAuthorsRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.postLike.count(),
    prisma.follow.count(),
    prisma.user.count({
      where: {
        joinedAt: { gte: startOfMonth },
      },
    }),
    prisma.user.findFirst({
      orderBy: [{ followers: { _count: "desc" } }, { username: "asc" }],
      select: {
        id: true,
        username: true,
        avatar: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    }),
    prisma.post.findFirst({
      orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.post.findFirst({
      orderBy: [{ comments: { _count: "desc" } }, { createdAt: "desc" }],
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    }),
    prisma.post.groupBy({
      by: ["authorId"],
      where: {
        createdAt: { gte: last90Days },
      },
      _count: {
        authorId: true,
      },
      orderBy: {
        _count: {
          authorId: "desc",
        },
      },
      take: 5,
    }),
    prisma.post.groupBy({
      by: ["authorId"],
      _count: {
        authorId: true,
      },
      orderBy: {
        _count: {
          authorId: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const activeUsers = await findUsersByIds(activeUsersRaw.map((row) => row.authorId));
  const allTimeTopAuthors = await findUsersByIds(allTimeTopAuthorsRaw.map((row) => row.authorId));

  const activeById = new Map(activeUsersRaw.map((row) => [row.authorId, row._count.authorId]));
  const allTimeById = new Map(allTimeTopAuthorsRaw.map((row) => [row.authorId, row._count.authorId]));

  return {
    generatedAt: now.toISOString(),
    overview: [
      {
        label: "Registered users",
        value: userCount.toLocaleString(),
        helper: `${newUsersThisMonth} joined this month`,
      },
      {
        label: "Published posts",
        value: postCount.toLocaleString(),
        helper: `${commentCount.toLocaleString()} comments across the feed`,
      },
      {
        label: "Average followers / user",
        value: userCount ? round(followCount / userCount).toFixed(1) : "0.0",
        helper: `${followCount.toLocaleString()} follow relationships recorded`,
      },
      {
        label: "Average posts / user",
        value: userCount ? round(postCount / userCount).toFixed(1) : "0.0",
        helper: `${likeCount.toLocaleString()} likes total`,
      },
      {
        label: "Average comments / post",
        value: postCount ? round(commentCount / postCount).toFixed(1) : "0.0",
        helper: "Good for measuring conversation density",
      },
      {
        label: "Average likes / post",
        value: postCount ? round(likeCount / postCount).toFixed(1) : "0.0",
        helper: "Quick pulse on engagement",
      },
    ],
    highlights: {
      mostFollowedUser: mostFollowedUser
        ? {
            username: mostFollowedUser.username,
            followerCount: mostFollowedUser._count.followers,
          }
        : null,
      mostActiveUserLast90Days: activeUsers[0]
        ? {
            username: activeUsers[0].username,
            postCount: activeById.get(activeUsers[0].id) ?? 0,
          }
        : null,
      mostLikedPost: mostLikedPost
        ? {
            author: mostLikedPost.author.username,
            likeCount: mostLikedPost._count.likes,
            excerpt: excerpt(mostLikedPost.content),
          }
        : null,
      mostDiscussedPost: mostDiscussedPost
        ? {
            author: mostDiscussedPost.author.username,
            commentCount: mostDiscussedPost._count.comments,
            excerpt: excerpt(mostDiscussedPost.content),
          }
        : null,
    },
    leaderboards: {
      activeUsersLast90Days: activeUsers.map((user) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        postCount: activeById.get(user.id) ?? 0,
      })),
      allTimeTopAuthors: allTimeTopAuthors.map((user) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        postCount: allTimeById.get(user.id) ?? 0,
      })),
    },
  };
}
