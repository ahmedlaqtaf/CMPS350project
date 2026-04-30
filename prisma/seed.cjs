const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const databaseUrl = `file:${path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/")}`;
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

function readJson(filename) {
  const filePath = path.join(process.cwd(), "data", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toDate(value) {
  return value ? new Date(value) : new Date();
}

async function clearDatabase() {
  await prisma.postLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers(users) {
  await prisma.user.createMany({
    data: users.map(({ followers, following, ...user }) => ({
      ...user,
      joinedAt: toDate(user.joinedAt),
    })),
  });

  const follows = users.flatMap((user) =>
    user.following.map((targetId) => ({
      followerId: user.id,
      followingId: targetId,
    })),
  );

  if (follows.length) {
    await prisma.follow.createMany({
      data: follows,
    });
  }
}

async function seedPosts(posts) {
  await prisma.post.createMany({
    data: posts.map(({ likes, comments, ...post }) => ({
      ...post,
      createdAt: toDate(post.createdAt),
    })),
  });

  const comments = posts.flatMap((post) =>
    post.comments.map((comment) => ({
      ...comment,
      postId: post.id,
      createdAt: toDate(comment.createdAt),
    })),
  );

  if (comments.length) {
    await prisma.comment.createMany({
      data: comments,
    });
  }

  const likes = posts.flatMap((post) =>
    post.likes.map((userId) => ({
      postId: post.id,
      userId,
    })),
  );

  if (likes.length) {
    await prisma.postLike.createMany({
      data: likes,
    });
  }
}

async function main() {
  const users = readJson("users.json");
  const posts = readJson("posts.json");

  await clearDatabase();
  await seedUsers(users);
  await seedPosts(posts);

  console.log(`Seeded ${users.length} users and ${posts.length} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
