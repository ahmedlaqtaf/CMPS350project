import Link from "next/link";
import { getDashboardStats } from "@/lib/repositories/stats-repository";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function renderMetricCards(metrics) {
  return metrics.map((metric) => (
    <article key={metric.label} className={styles.metricCard}>
      <p className={styles.metricLabel}>{metric.label}</p>
      <h2 className={styles.metricValue}>{metric.value}</h2>
      <p className={styles.metricHelper}>{metric.helper}</p>
    </article>
  ));
}

function renderLeaderboard(items, valueLabel) {
  if (!items.length) {
    return <p className={styles.empty}>No data yet.</p>;
  }

  return (
    <div className={styles.leaderboard}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.leaderboardRow}>
          <div className={styles.leaderboardRank}>#{index + 1}</div>
          <div className={styles.leaderboardMeta}>
            <strong>{item.username}</strong>
            <span>{valueLabel(item)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function StatsPage() {
  const stats = await getDashboardStats();

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Phase 2 Analytics</span>
          <h1>Twizzle statistics powered by Prisma queries.</h1>
          <p>
            This dashboard reads directly from the SQLite database and surfaces engagement,
            growth, and activity trends for the social platform.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link href="/twizzle/index.html" className={styles.primaryLink}>
            Open Twizzle
          </Link>
          <p className={styles.generatedAt}>
            Refreshed from the database at{" "}
            {new Date(stats.generatedAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </section>

      <section className={styles.metricGrid}>{renderMetricCards(stats.overview)}</section>

      <section className={styles.highlights}>
        <article className={styles.highlightCard}>
          <p className={styles.highlightLabel}>Most followed user</p>
          <h3>{stats.highlights.mostFollowedUser?.username ?? "No data"}</h3>
          <p>
            {stats.highlights.mostFollowedUser
              ? `${stats.highlights.mostFollowedUser.followerCount} followers`
              : "No follower relationships yet."}
          </p>
        </article>

        <article className={styles.highlightCard}>
          <p className={styles.highlightLabel}>Most active user in the last 90 days</p>
          <h3>{stats.highlights.mostActiveUserLast90Days?.username ?? "No data"}</h3>
          <p>
            {stats.highlights.mostActiveUserLast90Days
              ? `${stats.highlights.mostActiveUserLast90Days.postCount} posts in the rolling 90-day window`
              : "No recent posts yet."}
          </p>
        </article>

        <article className={styles.highlightCard}>
          <p className={styles.highlightLabel}>Most liked post</p>
          <h3>{stats.highlights.mostLikedPost?.author ?? "No data"}</h3>
          <p>
            {stats.highlights.mostLikedPost
              ? `${stats.highlights.mostLikedPost.likeCount} likes`
              : "No likes recorded yet."}
          </p>
          <blockquote>{stats.highlights.mostLikedPost?.excerpt}</blockquote>
        </article>

        <article className={styles.highlightCard}>
          <p className={styles.highlightLabel}>Most discussed post</p>
          <h3>{stats.highlights.mostDiscussedPost?.author ?? "No data"}</h3>
          <p>
            {stats.highlights.mostDiscussedPost
              ? `${stats.highlights.mostDiscussedPost.commentCount} comments`
              : "No comments recorded yet."}
          </p>
          <blockquote>{stats.highlights.mostDiscussedPost?.excerpt}</blockquote>
        </article>
      </section>

      <section className={styles.boards}>
        <article className={styles.boardCard}>
          <div className={styles.boardHeader}>
            <h2>Top authors in the last 90 days</h2>
            <p>Query-driven ranking based on post count in the recent activity window.</p>
          </div>
          {renderLeaderboard(stats.leaderboards.activeUsersLast90Days, (item) => `${item.postCount} posts`)}
        </article>

        <article className={styles.boardCard}>
          <div className={styles.boardHeader}>
            <h2>All-time posting leaders</h2>
            <p>Useful for showing which accounts drive the largest share of platform activity.</p>
          </div>
          {renderLeaderboard(stats.leaderboards.allTimeTopAuthors, (item) => `${item.postCount} posts`)}
        </article>
      </section>
    </main>
  );
}
