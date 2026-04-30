const KEYS = {
  SESSION: "Twizzle_session",
};

let currentView = "feed";
let viewingProfileId = null;
let modalPostId = null;
let currentUser = null;
let toastTimer = null;

function getSessionId() {
  return localStorage.getItem(KEYS.SESSION);
}

function setSession(userId) {
  localStorage.setItem(KEYS.SESSION, userId);
}

function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

function getViewerQuery() {
  const viewerId = getSessionId();
  const params = new URLSearchParams();
  if (viewerId) {
    params.set("viewerId", viewerId);
  }
  return params.toString();
}

async function apiFetch(path, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  const response = await fetch(path, config);
  let payload = {};

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

async function fetchSessionUser() {
  const viewerQuery = getViewerQuery();
  if (!viewerQuery) {
    return null;
  }

  const { user } = await apiFetch(`/api/users/me?${viewerQuery}`);
  return user;
}

async function loginUser(email, password) {
  const { user } = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  setSession(user.id);
  return user;
}

async function registerUser(payload) {
  const { user } = await apiFetch("/api/auth/register", {
    method: "POST",
    body: payload,
  });

  setSession(user.id);
  return user;
}

async function fetchFeedPosts() {
  const { posts } = await apiFetch(`/api/posts/feed?${getViewerQuery()}`);
  return posts;
}

async function fetchExploreUsers(searchTerm = "") {
  const params = new URLSearchParams(getViewerQuery());
  if (searchTerm.trim()) {
    params.set("search", searchTerm.trim());
  }

  const { users } = await apiFetch(`/api/users/explore?${params.toString()}`);
  return users;
}

async function fetchSuggestedUsers() {
  const { users } = await apiFetch(`/api/users/suggestions?${getViewerQuery()}`);
  return users;
}

async function fetchProfile(userId) {
  const { profile } = await apiFetch(`/api/users/${userId}?${getViewerQuery()}`);
  return profile;
}

async function fetchPost(postId) {
  const { post } = await apiFetch(`/api/posts/${postId}?${getViewerQuery()}`);
  return post;
}

async function createPost(content) {
  const { post } = await apiFetch(`/api/posts?${getViewerQuery()}`, {
    method: "POST",
    body: { content },
  });
  return post;
}

async function deletePost(postId) {
  await apiFetch(`/api/posts/${postId}?${getViewerQuery()}`, {
    method: "DELETE",
  });
}

async function toggleLike(postId) {
  return apiFetch(`/api/posts/${postId}/like`, {
    method: "POST",
    body: { viewerId: getSessionId() },
  });
}

async function addComment(postId, content) {
  return apiFetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: {
      viewerId: getSessionId(),
      content,
    },
  });
}

async function toggleFollow(targetId) {
  return apiFetch(`/api/users/${targetId}/follow`, {
    method: "POST",
    body: { viewerId: getSessionId() },
  });
}

async function updateProfile(payload) {
  const sessionId = getSessionId();
  const { user } = await apiFetch(`/api/users/${sessionId}?${getViewerQuery()}`, {
    method: "PATCH",
    body: payload,
  });
  return user;
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const GRADIENTS = [
  "linear-gradient(135deg,#6366F1,#EC4899)",
  "linear-gradient(135deg,#10B981,#3B82F6)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#8B5CF6,#06B6D4)",
  "linear-gradient(135deg,#14B8A6,#6366F1)",
  "linear-gradient(135deg,#F97316,#A855F7)",
];

function avatarGradient(userId) {
  const sum = [...String(userId)].reduce((total, char) => total + char.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

function makeAvatar(user, sizeClass = "av-md") {
  const initials = esc((user.username || "?").slice(0, 2).toUpperCase());
  const bg = avatarGradient(user.id);

  if (user.avatar) {
    return `<div class="avatar ${sizeClass}" style="background:${bg}" title="${esc(user.username)}">`
      + `${initials}`
      + `<img src="${esc(user.avatar)}" alt="${esc(user.username)}" onerror="this.remove()">`
      + `</div>`;
  }

  return `<div class="avatar ${sizeClass}" style="background:${bg}" title="${esc(user.username)}">${initials}</div>`;
}

function showFieldError(id, message) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = message;
  }
}

function clearFieldErrors(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = "";
    }
  });
}

function resetAlert(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = "";
  element.className = "form-alert";
}

function setAlert(id, message) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = message;
  element.className = "form-alert error";
}

function toast(message, duration = 2600) {
  const container = document.getElementById("toast");
  const text = document.getElementById("toast-text");
  if (!container || !text) {
    return;
  }

  text.textContent = message;
  container.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    container.classList.add("hidden");
  }, duration);
}

function showAuthScreen() {
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
}

async function showAppScreen() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");

  const ready = await bootApp();
  if (!ready) {
    return;
  }

  await showView("feed");
}

async function bootApp() {
  try {
    currentUser = await fetchSessionUser();
  } catch (error) {
    clearSession();
    currentUser = null;
    showAuthScreen();
    toast("Please sign in again.");
    return false;
  }

  if (!currentUser) {
    showAuthScreen();
    return false;
  }

  const sidebar = document.getElementById("sidebar-user-card");
  if (sidebar) {
    sidebar.innerHTML =
      makeAvatar(currentUser, "av-sm")
      + `<div class="suc-info">`
      + `<div class="suc-name">${esc(currentUser.username)}</div>`
      + `<div class="suc-handle">@${esc(currentUser.username)}</div>`
      + `</div>`;
  }

  const createPostAvatar = document.getElementById("create-post-avatar");
  if (createPostAvatar) {
    createPostAvatar.innerHTML = makeAvatar(currentUser, "av-md");
  }

  await renderSuggestedUsers();
  return true;
}

async function showView(name) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.add("hidden");
  });

  const selectedView = document.getElementById(`view-${name}`);
  if (selectedView) {
    selectedView.classList.remove("hidden");
  }

  currentView = name;

  document.querySelectorAll("[data-view]").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === name);
  });

  if (name === "feed") await renderFeed();
  if (name === "explore") await renderExplore(document.getElementById("search-input").value);
  if (name === "profile") await renderProfile(viewingProfileId || getSessionId());
}

async function rerenderCurrentView() {
  if (currentView === "feed") {
    await renderFeed();
  } else if (currentView === "explore") {
    await renderExplore(document.getElementById("search-input").value);
  } else if (currentView === "profile") {
    await renderProfile(viewingProfileId || getSessionId());
  }
}

async function viewUserProfile(userId) {
  viewingProfileId = userId;
  await showView("profile");
}

function renderLoading(container, title = "Loading...", message = "Please wait a moment.") {
  container.innerHTML = `
    <div class="empty-state">
      <h3>${esc(title)}</h3>
      <p>${esc(message)}</p>
    </div>`;
}

async function renderFeed() {
  const container = document.getElementById("feed-posts");
  if (!container) return;

  renderLoading(container, "Loading your feed...");

  try {
    const posts = await fetchFeedPosts();

    if (!posts.length) {
      container.innerHTML = `
        <div class="empty-state">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3>Your feed is empty</h3>
          <p>Follow some users from Explore to see their posts here,<br>or create your own first post!</p>
        </div>`;
      return;
    }

    container.innerHTML = posts.map(buildPostCard).join("");
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Could not load the feed</h3>
        <p>${esc(error.message)}</p>
      </div>`;
  }
}

function buildPostCard(post) {
  const likeIcon = `<svg viewBox="0 0 24 24" fill="${post.likedByViewer ? "currentColor" : "none"}"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;

  const commentIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>`;

  const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>`;

  return `
<article class="post-card" data-post-id="${post.id}">
  <div class="post-card-inner">
    <div class="post-author-row">
      <div class="post-author-info" onclick="viewUserProfile('${post.author.id}')">
        ${makeAvatar(post.author, "av-sm")}
        <div>
          <div class="post-author-name">${esc(post.author.username)}</div>
          <div class="post-timestamp">${timeAgo(post.createdAt)}</div>
        </div>
      </div>
    </div>

    <p class="post-body" onclick="openPostModal('${post.id}')">${esc(post.content)}</p>

    <div class="post-footer">
      <button class="post-btn btn-like ${post.likedByViewer ? "liked" : ""}"
              onclick="handleLike('${post.id}')"
              aria-label="Like post">
        ${likeIcon}
        <span>${post.likeCount} ${post.likeCount === 1 ? "Like" : "Likes"}</span>
      </button>

      <button class="post-btn btn-comment"
              onclick="openPostModal('${post.id}')"
              aria-label="View comments">
        ${commentIcon}
        <span>${post.commentCount} ${post.commentCount === 1 ? "Comment" : "Comments"}</span>
      </button>

      ${post.isOwner
        ? `<button class="post-btn btn-delete"
                   onclick="handleDelete('${post.id}')"
                   aria-label="Delete post">
             ${trashIcon}
             <span>Delete</span>
           </button>`
        : ""}
    </div>
  </div>
</article>`;
}

async function renderExplore(searchTerm = "") {
  const container = document.getElementById("explore-grid");
  if (!container) return;

  renderLoading(container, "Searching users...");

  try {
    const users = await fetchExploreUsers(searchTerm);

    if (!users.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3>No users found</h3>
          <p>Try a different search term.</p>
        </div>`;
      return;
    }

    container.innerHTML = users.map(buildUserCard).join("");
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <h3>Could not load users</h3>
        <p>${esc(error.message)}</p>
      </div>`;
  }
}

function buildUserCard(user) {
  return `
<div class="user-card" role="listitem">
  <div onclick="viewUserProfile('${user.id}')" style="cursor:pointer">
    ${makeAvatar(user, "av-lg")}
  </div>
  <div class="uc-name" onclick="viewUserProfile('${user.id}')">${esc(user.username)}</div>
  <div class="uc-bio">${esc(user.bio || "No bio yet.")}</div>
  <div class="uc-stats">
    <div class="stat-item">
      <span class="stat-number">${user.postCount}</span>
      <span class="stat-label">Posts</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">${user.followerCount}</span>
      <span class="stat-label">Followers</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">${user.followingCount}</span>
      <span class="stat-label">Following</span>
    </div>
  </div>
  <button class="btn btn-sm ${user.followedByViewer ? "btn-outline" : "btn-primary"}"
          onclick="handleFollow('${user.id}')">
    ${user.followedByViewer ? "Unfollow" : "Follow"}
  </button>
</div>`;
}

async function renderProfile(userId) {
  const container = document.getElementById("profile-container");
  if (!container) return;

  renderLoading(container, "Loading profile...");

  try {
    const user = await fetchProfile(userId);

    container.innerHTML = `
      <div class="profile-card">
        <div class="profile-banner"></div>
        <div class="profile-info-area">
          <div class="profile-avatar-wrap">
            ${makeAvatar(user, "av-xl")}
          </div>

          <div class="profile-username">${esc(user.username)}</div>
          <div class="profile-handle">@${esc(user.username)}</div>

          <p class="profile-bio">
            ${user.bio ? esc(user.bio) : '<em style="color:var(--text-muted)">No bio yet.</em>'}
          </p>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-number">${user.postCount}</span>
              <span class="stat-label">Posts</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${user.followerCount}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${user.followingCount}</span>
              <span class="stat-label">Following</span>
            </div>
          </div>

          <div class="profile-actions">
            ${user.isMe
              ? `<button class="btn btn-outline btn-sm" onclick="openEditModal()">Edit Profile</button>`
              : `<button class="btn btn-sm ${user.followedByViewer ? "btn-outline" : "btn-primary"}"
                         onclick="handleFollow('${user.id}')">
                   ${user.followedByViewer ? "Unfollow" : "Follow"}
                 </button>`}
          </div>
        </div>
      </div>

      <div class="profile-posts-label">
        ${user.isMe ? "Your Posts" : `${esc(user.username)}'s Posts`} (${user.postCount})
      </div>
      <div class="posts-list" id="profile-posts-list">
        ${user.postCount
          ? user.posts.map(buildPostCard).join("")
          : `<div class="empty-state">
               <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                 <polyline points="14 2 14 8 20 8"/>
               </svg>
               <h3>No posts yet</h3>
               <p>${user.isMe ? "Create your first post from Home!" : "Nothing posted yet."}</p>
             </div>`}
      </div>`;
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Could not load profile</h3>
        <p>${esc(error.message)}</p>
      </div>`;
  }
}

async function renderSuggestedUsers() {
  const container = document.getElementById("suggested-users");
  if (!container) return;

  try {
    const users = await fetchSuggestedUsers();

    if (!users.length) {
      container.innerHTML = `<p class="widget-text">You're following everyone!</p>`;
      return;
    }

    container.innerHTML = users.map((user) => `
      <div class="suggest-item">
        ${makeAvatar(user, "av-sm")}
        <div class="suggest-info">
          <div class="suggest-name" onclick="viewUserProfile('${user.id}')">${esc(user.username)}</div>
          <div class="suggest-bio">${esc(user.bio || "No bio")}</div>
        </div>
        <button class="btn btn-sm btn-primary" onclick="handleFollow('${user.id}')">Follow</button>
      </div>`).join("");
  } catch (error) {
    container.innerHTML = `<p class="widget-text">${esc(error.message)}</p>`;
  }
}

function buildCommentItem(comment) {
  return `
<div class="comment-item">
  ${makeAvatar(comment.author, "av-sm")}
  <div class="comment-bubble">
    <span class="comment-author" onclick="closePostModal(); viewUserProfile('${comment.author.id}')">
      ${esc(comment.author.username)}
    </span>
    <p class="comment-text">${esc(comment.content)}</p>
    <div class="comment-time">${timeAgo(comment.createdAt)}</div>
  </div>
</div>`;
}

async function openPostModal(postId) {
  modalPostId = postId;

  try {
    const post = await fetchPost(postId);
    const likeIcon = `<svg viewBox="0 0 24 24" fill="${post.likedByViewer ? "currentColor" : "none"}"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>`;

    const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;

    const commentsHtml = post.comments.length
      ? post.comments.map(buildCommentItem).join("")
      : '<p class="no-comments">No comments yet — be the first!</p>';

    document.getElementById("post-modal-body").innerHTML = `
      <div class="modal-author-row" onclick="closePostModal(); viewUserProfile('${post.author.id}')">
        ${makeAvatar(post.author, "av-md")}
        <div>
          <div class="modal-author-name">${esc(post.author.username)}</div>
          <div class="modal-author-time">${timeAgo(post.createdAt)}</div>
        </div>
      </div>

      <p class="modal-post-text">${esc(post.content)}</p>

      <div class="modal-meta">
        ${new Date(post.createdAt).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      <div class="modal-actions">
        <button class="post-btn btn-like ${post.likedByViewer ? "liked" : ""}"
                onclick="handleLike('${post.id}')"
                aria-label="Like">
          ${likeIcon}
          <span>${post.likeCount} ${post.likeCount === 1 ? "Like" : "Likes"}</span>
        </button>
        ${post.isOwner
          ? `<button class="post-btn btn-delete"
                     onclick="handleDelete('${post.id}')"
                     aria-label="Delete post">
               ${trashIcon}
               <span>Delete</span>
             </button>`
          : ""}
      </div>

      <div class="comments-title">
        ${post.commentCount} ${post.commentCount === 1 ? "Comment" : "Comments"}
      </div>

      <div class="comment-input-row">
        ${makeAvatar(currentUser, "av-sm")}
        <textarea id="modal-comment-input"
                  placeholder="Write a comment…"
                  rows="2"
                  aria-label="Comment text"></textarea>
        <button class="btn btn-primary btn-sm" onclick="handleAddComment('${post.id}')">Post</button>
      </div>

      <div class="comments-list" id="modal-comments-list">
        ${commentsHtml}
      </div>`;

    document.getElementById("post-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } catch (error) {
    toast(error.message);
  }
}

function closePostModal() {
  modalPostId = null;
  document.getElementById("post-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

function openEditModal() {
  if (!currentUser) return;

  document.getElementById("edit-username").value = currentUser.username;
  document.getElementById("edit-bio").value = currentUser.bio || "";
  document.getElementById("edit-avatar").value = currentUser.avatar || "";

  document.getElementById("err-edit-username").textContent = "";
  resetAlert("alert-edit");

  document.getElementById("edit-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("edit-username").focus();
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

function switchTab(name) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");

  if (name === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    tabLogin.classList.remove("active");
    tabRegister.classList.add("active");
  }
}

function validateRegister(username, email, password, confirm) {
  const errors = {};
  const cleanUsername = username.trim();
  const cleanEmail = email.trim();

  if (!cleanUsername) {
    errors.username = "Username is required.";
  } else if (cleanUsername.length < 3 || cleanUsername.length > 20) {
    errors.username = "Must be 3–20 characters.";
  } else if (!/^[A-Za-z0-9_]+$/.test(cleanUsername)) {
    errors.username = "Only letters, numbers, and underscores.";
  }

  if (!cleanEmail) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Minimum 8 characters.";
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Include at least one letter and one number.";
  }

  if (password !== confirm) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}

async function handleLogin(event) {
  event.preventDefault();
  clearFieldErrors(["err-login-email", "err-login-password"]);
  resetAlert("alert-login");

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email.trim()) {
    showFieldError("err-login-email", "Email is required.");
    return;
  }

  if (!password.trim()) {
    showFieldError("err-login-password", "Password is required.");
    return;
  }

  try {
    await loginUser(email, password);
    await showAppScreen();
  } catch (error) {
    setAlert("alert-login", error.message);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearFieldErrors(["err-reg-username", "err-reg-email", "err-reg-password", "err-reg-confirm"]);
  resetAlert("alert-register");

  const username = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const confirm = document.getElementById("reg-confirm").value;
  const errors = validateRegister(username, email, password, confirm);

  if (Object.keys(errors).length) {
    if (errors.username) showFieldError("err-reg-username", errors.username);
    if (errors.email) showFieldError("err-reg-email", errors.email);
    if (errors.password) showFieldError("err-reg-password", errors.password);
    if (errors.confirm) showFieldError("err-reg-confirm", errors.confirm);
    return;
  }

  try {
    await registerUser({ username, email, password });
    await showAppScreen();
    toast("Welcome to Twizzle!");
  } catch (error) {
    setAlert("alert-register", error.message);
  }
}

async function handleCreatePost() {
  const textarea = document.getElementById("post-textarea");
  const content = textarea.value.trim();

  if (!content) {
    toast("Write something before posting!");
    return;
  }

  try {
    await createPost(content);
    textarea.value = "";
    document.getElementById("char-count").textContent = "0";
    document.querySelector(".char-counter").classList.remove("near-limit");
    await renderFeed();
    toast("Posted!");
  } catch (error) {
    toast(error.message);
  }
}

async function handleLike(postId) {
  try {
    await toggleLike(postId);
    await rerenderCurrentView();
    if (modalPostId === postId) {
      await openPostModal(postId);
    }
  } catch (error) {
    toast(error.message);
  }
}

async function handleDelete(postId) {
  if (!confirm("Delete this post? This cannot be undone.")) {
    return;
  }

  try {
    await deletePost(postId);
    closePostModal();
    await rerenderCurrentView();
    await bootApp();
    toast("Post deleted.");
  } catch (error) {
    toast(error.message);
  }
}

async function handleAddComment(postId) {
  const textarea = document.getElementById("modal-comment-input");
  const content = textarea ? textarea.value.trim() : "";

  if (!content) {
    toast("Write a comment first!");
    return;
  }

  try {
    await addComment(postId, content);
    await rerenderCurrentView();
    await openPostModal(postId);
    toast("Comment added!");
  } catch (error) {
    toast(error.message);
  }
}

async function handleFollow(targetId) {
  try {
    const result = await toggleFollow(targetId);
    await bootApp();
    await rerenderCurrentView();
    if (modalPostId) {
      await openPostModal(modalPostId);
    }
    toast(result.nowFollowing ? "User followed." : "User unfollowed.");
  } catch (error) {
    toast(error.message);
  }
}

async function handleEditProfile(event) {
  event.preventDefault();
  document.getElementById("err-edit-username").textContent = "";
  resetAlert("alert-edit");

  const username = document.getElementById("edit-username").value.trim();
  const bio = document.getElementById("edit-bio").value;
  const avatar = document.getElementById("edit-avatar").value;

  if (!username) {
    showFieldError("err-edit-username", "Username cannot be empty.");
    return;
  }

  try {
    currentUser = await updateProfile({ username, bio, avatar });
    closeEditModal();
    await bootApp();
    viewingProfileId = getSessionId();
    await showView("profile");
    toast("Profile updated!");
  } catch (error) {
    setAlert("alert-edit", error.message);
  }
}

function logoutUser() {
  clearSession();
  currentUser = null;
  viewingProfileId = null;
  closePostModal();
  closeEditModal();
  switchTab("login");
  showAuthScreen();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (getSessionId()) {
    await showAppScreen();
  } else {
    showAuthScreen();
  }

  document.getElementById("tab-login").addEventListener("click", () => switchTab("login"));
  document.getElementById("tab-register").addEventListener("click", () => switchTab("register"));
  document.getElementById("link-go-register").addEventListener("click", (event) => {
    event.preventDefault();
    switchTab("register");
  });
  document.getElementById("link-go-login").addEventListener("click", (event) => {
    event.preventDefault();
    switchTab("login");
  });

  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("register-form").addEventListener("submit", handleRegister);
  document.getElementById("logout-btn").addEventListener("click", logoutUser);

  document.querySelectorAll("[data-view]").forEach((element) => {
    element.addEventListener("click", async (event) => {
      event.preventDefault();
      const view = element.dataset.view;
      if (view === "profile") {
        viewingProfileId = getSessionId();
      }
      await showView(view);
    });
  });

  document.getElementById("btn-submit-post").addEventListener("click", handleCreatePost);
  document.getElementById("post-textarea").addEventListener("input", function () {
    const count = this.value.length;
    const counter = document.getElementById("char-count");
    counter.textContent = count;
    counter.parentElement.classList.toggle("near-limit", count > 250);
  });
  document.getElementById("post-textarea").addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleCreatePost();
    }
  });

  document.getElementById("btn-close-post-modal").addEventListener("click", closePostModal);
  document.getElementById("post-modal-backdrop").addEventListener("click", closePostModal);

  document.getElementById("btn-close-edit-modal").addEventListener("click", closeEditModal);
  document.getElementById("edit-modal-backdrop").addEventListener("click", closeEditModal);
  document.getElementById("btn-cancel-edit").addEventListener("click", closeEditModal);
  document.getElementById("edit-profile-form").addEventListener("submit", handleEditProfile);

  document.getElementById("search-input").addEventListener("input", (event) => {
    renderExplore(event.target.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePostModal();
      closeEditModal();
    }
  });
});
