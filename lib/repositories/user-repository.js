import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  buildPostCardSelect,
  mapCurrentUser,
  mapDiscoverUser,
  mapPostCard,
} from "@/lib/repositories/mappers";

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function normalizeUsername(username = "") {
  return username.trim();
}

function validatePassword(password = "") {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function validateUsername(username) {
  return username.length >= 3 && username.length <= 20 && /^[A-Za-z0-9_]+$/.test(username);
}

function validateAvatarUrl(avatar) {
  if (!avatar) {
    return true;
  }

  try {
    new URL(avatar);
    return true;
  } catch {
    return false;
  }
}

async function ensureUserExists(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
}

export async function getCurrentUser(viewerId) {
  const user = await prisma.user.findUnique({
    where: { id: viewerId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return mapCurrentUser(user);
}

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      password: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("No account found with that email.", 404);
  }

  if (user.password !== password) {
    throw new AppError("Incorrect password.", 401);
  }

  return mapCurrentUser(user);
}

export async function registerUser({ username, email, password }) {
  const cleanUsername = normalizeUsername(username);
  const cleanEmail = normalizeEmail(email);

  if (!validateUsername(cleanUsername)) {
    throw new AppError("Username must be 3 to 20 characters using only letters, numbers, or underscores.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new AppError("Please enter a valid email address.");
  }

  if (!validatePassword(password)) {
    throw new AppError("Password must be at least 8 characters and include a letter and a number.");
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: cleanUsername }, { email: cleanEmail }],
    },
    select: {
      username: true,
      email: true,
    },
  });

  if (existing?.username === cleanUsername) {
    throw new AppError("Username already taken.", 409);
  }

  if (existing?.email === cleanEmail) {
    throw new AppError("Email already registered.", 409);
  }

  const user = await prisma.user.create({
    data: {
      id: `u_${randomUUID().slice(0, 12)}`,
      username: cleanUsername,
      email: cleanEmail,
      password,
      bio: "",
      avatar: "",
      joinedAt: new Date(),
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return mapCurrentUser(user);
}

export async function getExploreUsers({ viewerId, searchTerm = "" }) {
  await ensureUserExists(viewerId);

  const search = searchTerm.trim();
  const users = await prisma.user.findMany({
    where: {
      NOT: { id: viewerId },
      ...(search
        ? {
            OR: [
              { username: { contains: search } },
              { bio: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: [{ followers: { _count: "desc" } }, { username: "asc" }],
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      followers: {
        where: { followerId: viewerId },
        select: { followerId: true },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return users.map(mapDiscoverUser);
}

export async function getSuggestedUsers(viewerId, limit = 6) {
  await ensureUserExists(viewerId);

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: viewerId },
      followers: {
        none: { followerId: viewerId },
      },
    },
    orderBy: [{ followers: { _count: "desc" } }, { username: "asc" }],
    take: limit,
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      followers: {
        where: { followerId: viewerId },
        select: { followerId: true },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return users.map(mapDiscoverUser);
}

export async function getProfile(userId, viewerId) {
  await ensureUserExists(viewerId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      followers: {
        where: { followerId: viewerId },
        select: { followerId: true },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        select: buildPostCardSelect(viewerId),
      },
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    joinedAt: user.joinedAt,
    postCount: user._count.posts,
    followerCount: user._count.followers,
    followingCount: user._count.following,
    isMe: user.id === viewerId,
    followedByViewer: (user.followers?.length ?? 0) > 0,
    posts: user.posts.map((post) => mapPostCard(post, viewerId)),
  };
}

export async function updateProfile({ viewerId, userId, username, bio, avatar }) {
  if (viewerId !== userId) {
    throw new AppError("You can only edit your own profile.", 403);
  }

  const cleanUsername = normalizeUsername(username);
  const cleanBio = (bio || "").trim();
  const cleanAvatar = (avatar || "").trim();

  if (!validateUsername(cleanUsername)) {
    throw new AppError("Username must be 3 to 20 characters using only letters, numbers, or underscores.");
  }

  if (cleanBio.length > 160) {
    throw new AppError("Bio must be 160 characters or fewer.");
  }

  if (!validateAvatarUrl(cleanAvatar)) {
    throw new AppError("Please provide a valid profile image URL or leave it blank.");
  }

  const conflict = await prisma.user.findFirst({
    where: {
      username: cleanUsername,
      NOT: { id: userId },
    },
    select: { id: true },
  });

  if (conflict) {
    throw new AppError("Username already taken.", 409);
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      username: cleanUsername,
      bio: cleanBio,
      avatar: cleanAvatar,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      joinedAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  return mapCurrentUser(updated);
}

export async function toggleFollow(viewerId, targetId) {
  if (viewerId === targetId) {
    throw new AppError("You cannot follow yourself.", 400);
  }

  await Promise.all([ensureUserExists(viewerId), ensureUserExists(targetId)]);

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: viewerId,
        followingId: targetId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: targetId,
        },
      },
    });

    return { nowFollowing: false };
  }

  await prisma.follow.create({
    data: {
      followerId: viewerId,
      followingId: targetId,
    },
  });

  return { nowFollowing: true };
}
