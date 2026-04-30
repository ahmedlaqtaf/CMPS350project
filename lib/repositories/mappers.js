export const compactUserSelect = {
  id: true,
  username: true,
  avatar: true,
};

export function buildPostCardSelect(viewerId) {
  return {
    id: true,
    content: true,
    createdAt: true,
    author: {
      select: compactUserSelect,
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    ...(viewerId
      ? {
          likes: {
            where: { userId: viewerId },
            select: { userId: true },
          },
        }
      : {}),
  };
}

export function buildPostDetailSelect(viewerId) {
  return {
    ...buildPostCardSelect(viewerId),
    comments: {
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: compactUserSelect,
        },
      },
    },
  };
}

export function mapCurrentUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    joinedAt: user.joinedAt,
    postCount: user._count?.posts ?? 0,
    followerCount: user._count?.followers ?? 0,
    followingCount: user._count?.following ?? 0,
  };
}

export function mapPostCard(post, viewerId) {
  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    author: post.author,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    likedByViewer: viewerId ? (post.likes?.length ?? 0) > 0 : false,
    isOwner: viewerId === post.author.id,
  };
}

export function mapPostDetail(post, viewerId) {
  return {
    ...mapPostCard(post, viewerId),
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.author,
    })),
  };
}

export function mapDiscoverUser(user) {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    postCount: user._count.posts,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    followedByViewer: (user.followers?.length ?? 0) > 0,
  };
}
