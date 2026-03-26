/* ============================================================
   -1  STORAGE KEYS
============================================================ */

const KEYS = {
  USERS:   'Twizzle_users',
  POSTS:   'Twizzle_posts',
  SESSION: 'Twizzle_session'
};


/* ============================================================
   -2  SEED DATA
   Pre-loaded on the very first app launch so the demo
   works immediately without registration.
============================================================ */

/** Helper: ISO string N days ago from now */
function dAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** Helper: ISO string N hours ago from now */
function hAgo(n) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

const SEED_USERS = [
  {
    id: 'u1', username: 'dana_r',
    email: 'dana@example.com', password: 'password123',
    bio: 'Working mom, 3 kids, one minivan, zero free time. I run on coffee and Sunday meal prep.',
    avatar: '',
    following: ['u2', 'u3'],
    followers: ['u2', 'u4', 'u5'],
    joinedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 'u2', username: 'carlos_82',
    email: 'carlos@example.com', password: 'password123',
    bio: 'Construction by day, grill master by weekend. Proud Silverado owner. Fantasy football legend in my own mind.',
    avatar: '',
    following: ['u1', 'u3', 'u4'],
    followers: ['u1', 'u3'],
    joinedAt: '2024-01-20T09:00:00.000Z'
  },
  {
    id: 'u3', username: 'noor.adventures',
    email: 'noor@example.com', password: 'password123',
    bio: 'College junior saving every penny for the next flight out. 12 countries so far. Hostel life is the real life.',
    avatar: '',
    following: ['u1', 'u2'],
    followers: ['u1', 'u2', 'u4'],
    joinedAt: '2024-02-01T10:00:00.000Z'
  },
  {
    id: 'u4', username: 'big_mike_d',
    email: 'mike@example.com', password: 'password123',
    bio: 'Dad of 2. I watch too much ESPN and have an opinion about literally everything. Don\'t get me started on grocery prices.',
    avatar: '',
    following: ['u1', 'u3'],
    followers: ['u2', 'u5'],
    joinedAt: '2024-02-10T11:00:00.000Z'
  },
  {
    id: 'u5', username: 'grandma_betty',
    email: 'betty@example.com', password: 'password123',
    bio: 'Retired teacher. My garden and my grandkids keep me young. If I bake it, you better eat it.',
    avatar: '',
    following: ['u2'],
    followers: ['u1', 'u4'],
    joinedAt: '2024-02-15T12:00:00.000Z'
  }
];

const SEED_POSTS = [
  {
    id: 'p1', authorId: 'u2',
    content: 'Spent all Saturday morning detailing the Silverado and I swear it looks better than the day I bought it. Clay bar, compound, ceramic coat, the whole deal. My back is destroyed but every time I walk past the driveway I just stand there staring at it like an idiot. My wife thinks I have a problem. She might be right honestly.',
    likes: ['u1', 'u3', 'u4'],
    comments: [
      { id: 'c1', authorId: 'u1', content: 'My husband does the exact same thing lol he will literally go outside at night with a flashlight to look at his car', createdAt: hAgo(23) },
      { id: 'c2', authorId: 'u4', content: 'Ceramic coat is no joke though. Did you do it yourself or take it somewhere? Been thinking about doing mine', createdAt: hAgo(22) }
    ],
    createdAt: hAgo(24)
  },
  {
    id: 'p2', authorId: 'u3',
    content: 'Just got back from 8 days in Portugal and I am already looking at flights to go back. Lisbon is insane, the food is stupid cheap for how good it is, and the hostels were actually really nice. I spent like $45 a day including everything. Everyone keeps telling me to go to Southeast Asia next but honestly southern Europe might just be my thing. Also the pasteis de nata changed my life, not even kidding.',
    likes: ['u1', 'u2'],
    comments: [
      { id: 'c3', authorId: 'u1', content: 'Ok you are really making me want to plan a trip. Was it easy to get around without knowing Portuguese?', createdAt: dAgo(1) }
    ],
    createdAt: dAgo(2)
  },
  {
    id: 'p3', authorId: 'u1',
    content: 'Made my mom\'s jerk chicken recipe for the kids tonight and they actually ate it without complaining for once. Like clean plates, no bargaining, no hiding food in napkins. I almost cried. My mom used to make this every Friday and the smell of it cooking just takes me right back to being 10 years old in her kitchen. Some recipes just carry love in them, I don\'t know how else to explain it.',
    likes: ['u2', 'u3', 'u5'],
    comments: [
      { id: 'c4', authorId: 'u5', content: 'That is so special honey. Family recipes are worth more than gold. I still make my mother\'s cornbread every single week', createdAt: dAgo(2) },
      { id: 'c5', authorId: 'u3', content: 'Clean plates from kids??? That is basically a miracle. Your mom\'s recipe must be something else', createdAt: dAgo(2) }
    ],
    createdAt: dAgo(3)
  },
  {
    id: 'p4', authorId: 'u4',
    content: 'Went to the grocery store yesterday for like 10 things and walked out spending $87. Eighty seven dollars. For basically nothing. Milk, eggs, chicken, some fruit, bread, cheese, and a couple snacks for the kids. That\'s it. I remember when $87 was a full cart. I\'m not even trying to make this political but something is seriously off when a regular family can\'t do a basic grocery run without it hurting. Anybody else feeling this or is it just me?',
    likes: ['u1', 'u3', 'u5'],
    comments: [],
    createdAt: dAgo(4)
  },
  {
    id: 'p5', authorId: 'u5',
    content: 'Pulled my first batch of tomatoes from the garden this morning and let me tell you there is nothing on earth like eating something you grew yourself. They are not perfect looking, a little lumpy, one of them is kind of shaped like a heart. But the taste? The store does not even come close. Harold always said the secret was talking to the plants. I still do it every morning even though he\'s been gone three years now. I think it works.',
    likes: ['u2', 'u3'],
    comments: [
      { id: 'c6', authorId: 'u1', content: 'Betty this made me tear up a little. Harold sounds like he was the sweetest man. And those tomatoes look amazing', createdAt: dAgo(4) }
    ],
    createdAt: dAgo(5)
  },
  {
    id: 'p6', authorId: 'u2',
    content: 'Drove out to the lake with a couple of the guys from work this weekend. No phones, no group chats, no checking emails. Just the truck, a cooler, some fishing rods, and absolutely terrible music from Ray\'s Bluetooth speaker. Caught nothing. Ate gas station hot dogs for lunch. It was honestly the best weekend I\'ve had in months. Sometimes you just need to unplug and do nothing with good people.',
    likes: ['u1', 'u3', 'u4'],
    comments: [
      { id: 'c7', authorId: 'u3', content: 'Gas station hot dogs hit different on a road trip and nobody can convince me otherwise', createdAt: dAgo(5) }
    ],
    createdAt: dAgo(6)
  },
  {
    id: 'p7', authorId: 'u5',
    content: 'My granddaughter called me this morning before school just to tell me she drew a picture of us baking cookies together and her teacher put it on the wall. She\'s 7 and she said "Grandma you\'re famous now because you\'re on the wall at my school." I have been smiling about it all day. I don\'t need much in this life but that phone call was everything.',
    likes: ['u1', 'u2', 'u3'],
    comments: [],
    createdAt: dAgo(7)
  },
  {
    id: 'p8', authorId: 'u4',
    content: 'That game last night was absolutely insane. I was ready to turn it off in the third quarter, we were down by 19 and it looked completely over. Then the fourth quarter happened and I lost my mind. My neighbor Dave came running over in his slippers and we were yelling in the driveway at 11pm. His wife came out and told us both to grow up. Dave said no. I respect that. What a comeback though seriously.',
    likes: ['u1', 'u2', 'u3', 'u5'],
    comments: [
      { id: 'c8', authorId: 'u2', content: 'Bro I fell asleep at halftime because I had work early. Woke up to like 40 texts. I am so mad at myself I will never recover from this', createdAt: dAgo(8) }
    ],
    createdAt: dAgo(9)
  },
  {
    id: 'p9', authorId: 'u1',
    content: 'My 5 year old lost his first tooth today and wrote the tooth fairy a note that said "dear tooth fairy please leave the money but can I also keep my tooth because I worked really hard on it." He also drew a picture of himself smiling with the gap. I have never loved a piece of paper more in my entire life. This is going in a frame, I don\'t even care.',
    likes: ['u2', 'u4', 'u5'],
    comments: [],
    createdAt: dAgo(10)
  },
  {
    id: 'p10', authorId: 'u3',
    content: 'Unpopular opinion maybe but the best part of any trip is never the touristy stuff on the checklist. It\'s always some random moment you didn\'t plan. Like the old couple in Morocco who invited me to drink tea with them even though we didn\'t share a single language. Or the street musician in Berlin who played the same song for 20 minutes because I told him I liked it. That stuff stays with you way longer than any landmark.',
    likes: ['u1', 'u2', 'u4'],
    comments: [
      { id: 'c9', authorId: 'u1', content: 'Yes!! Our best family vacation memory is literally just playing cards with strangers we met at a pool in Mexico. Nothing fancy at all but we still talk about it', createdAt: dAgo(10) }
    ],
    createdAt: dAgo(11)
  }
];


/* ============================================================
   -3  LOCAL STORAGE LAYER
   All read / write operations go through these functions.
============================================================ */

/** Read users array from localStorage */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
  } catch (e) {
    return [];
  }
}

/** Persist users array to localStorage */
function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

/** Read posts array from localStorage */
function getPosts() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.POSTS)) || [];
  } catch (e) {
    return [];
  }
}

/** Persist posts array to localStorage */
function savePosts(posts) {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

/** Return the logged-in user's ID string, or null */
function getSessionId() {
  return localStorage.getItem(KEYS.SESSION);
}

/** Return the full logged-in user object (always fresh from storage) */
function getSessionUser() {
  const id = getSessionId();
  if (id) {
    return getUsers().find(u => u.id === id) || null;
  }
  return null;
}

/** Persist session (user ID) */
function setSession(userId) {
  localStorage.setItem(KEYS.SESSION, userId);
}

/** Remove session (logout) */
function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

/* Lookup helpers */
function findUserById(id) {
  return getUsers().find(u => u.id === id) || null;
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

function findUserByUsername(name) {
  return getUsers().find(u => u.username.toLowerCase() === name.trim().toLowerCase()) || null;
}


/* ============================================================
   -4  SEED DATA INITIALISATION
============================================================ */

/**
 * Called once at app start.
 * Only writes to localStorage if keys don't exist yet
 * (i.e., first ever visit or after clearing storage).
 */
function initSeedData() {
  if (!localStorage.getItem(KEYS.USERS)) {
    saveUsers(SEED_USERS);
  }
  if (!localStorage.getItem(KEYS.POSTS)) {
    savePosts(SEED_POSTS);
  }
}


/* ============================================================
   -5  AUTH MODULE
============================================================ */

/**
 * Validate all register form fields.
 * Returns { valid: boolean, errors: { field: message } }
 */
function validateRegister(username, email, password, confirm) {
  const errors = {};
  const u = username.trim();
  const e = email.trim();

  /* Username: 3–20 chars, letters / digits / underscores */
  if (!u) {
    errors.username = 'Username is required.';
  } else if (u.length < 3 || u.length > 20) {
    errors.username = 'Must be 3–20 characters.';
  } else if (!/^[a-zA-Z0-9_]+$/.test(u)) {
    errors.username = 'Only letters, numbers, and underscores.';
  } else if (findUserByUsername(u)) {
    errors.username = 'Username already taken.';
  }

  /* Email: basic format */
  if (!e) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    errors.email = 'Enter a valid email address.';
  } else if (findUserByEmail(e)) {
    errors.email = 'Email already registered.';
  }

  /* Password: ≥8 chars, ≥1 letter, ≥1 digit */
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Minimum 8 characters.';
  } else if (!/[a-zA-Z]/.test(password)) {
    errors.password = 'Include at least one letter.';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Include at least one number.';
  }

  /* Confirm */
  if (password && password !== confirm)  errors.confirm = 'Passwords do not match.';

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Create a new user and return the object.
 * Assumes inputs have already been validated.
 */
function registerUser(username, email, password) {
  const users = getUsers();
  const newUser = {
    id: 'u_' + Date.now(),
    username: username.trim(),
    email:    email.trim().toLowerCase(),
    password,
    bio: '',
    avatar: '',
    following: [],
    followers: [],
    joinedAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

/**
 * Attempt login.
 * Returns { success: true, user } or { success: false, error: string }
 */
function loginUser(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, error: 'No account found with that email.' };
  }
  if (user.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }
  setSession(user.id);
  return { success: true, user };
}

/** Clear session and return to auth screen */
function logoutUser() {
  clearSession();
  showAuthScreen();
}


/* ============================================================
   -6  POST MODULE
============================================================ */

/**
 * Create a new post for the current user.
 * Returns the post object or null on failure.
 */
function createPost(content) {
  const user = getSessionUser();
  if (!user || !content.trim()) return null;

  const posts = getPosts();
  const post = {
    id: 'p_' + Date.now(),
    authorId: user.id,
    content:  content.trim(),
    likes:    [],
    comments: [],
    createdAt: new Date().toISOString()
  };
  posts.unshift(post);   // newest first
  savePosts(posts);
  return post;
}

/**
 * Delete a post by ID.
 * Only the post's author may delete.
 * Returns boolean success.
 */
function deletePost(postId) {
  const user = getSessionUser();
  if (!user) return false;

  const posts  = getPosts();
  const post   = posts.find(p => p.id === postId);
  if (!post || post.authorId !== user.id) return false;

  savePosts(posts.filter(p => p.id !== postId));
  return true;
}

/**
 * Toggle like / unlike on a post.
 * Returns the updated post or null.
 */
function toggleLike(postId) {
  const user = getSessionUser();
  if (!user) return null;

  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (!post) return null;

  const idx = post.likes.indexOf(user.id);
  if (idx === -1) post.likes.push(user.id);
  else            post.likes.splice(idx, 1);

  savePosts(posts);
  return post;
}

/**
 * Add a comment to a post.
 * Returns the new comment object or null.
 */
function addComment(postId, content) {
  const user = getSessionUser();
  if (!user || !content.trim()) return null;

  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (!post) return null;

  const comment = {
    id:        'c_' + Date.now(),
    authorId:  user.id,
    content:   content.trim(),
    createdAt: new Date().toISOString()
  };
  post.comments.push(comment);
  savePosts(posts);
  return comment;
}

/**
 * Return posts for the home feed:
 * own posts + posts by followed users, sorted newest first.
 */
function getFeedPosts() {
  const user = getSessionUser();
  if (!user) return [];
  const allowed = new Set([user.id, ...user.following]);
  return getPosts()
    .filter(p => allowed.has(p.authorId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Return all posts by a specific user, sorted newest first. */
function getPostsByUser(userId) {
  return getPosts()
    .filter(p => p.authorId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}


/* ============================================================
   -7  USER / SOCIAL MODULE
============================================================ */

/**
 * Toggle follow / unfollow target user.
 * Returns { nowFollowing: boolean } or null on error.
 */
function toggleFollow(targetId) {
  const me = getSessionUser();
  if (!me || me.id === targetId) return null;

  const users      = getUsers();
  const myRecord   = users.find(u => u.id === me.id);
  const theirRecord = users.find(u => u.id === targetId);
  if (!myRecord || !theirRecord) return null;

  const idx = myRecord.following.indexOf(targetId);
  if (idx === -1) {
    /* Follow */
    myRecord.following.push(targetId);
    if (!theirRecord.followers.includes(me.id))
      theirRecord.followers.push(me.id);
  } else {
    /* Unfollow */
    myRecord.following.splice(idx, 1);
    const fIdx = theirRecord.followers.indexOf(me.id);
    if (fIdx !== -1) theirRecord.followers.splice(fIdx, 1);
  }

  saveUsers(users);
  return { nowFollowing: idx === -1 };
}

/** Returns true if the current session user follows targetId */
function isFollowing(targetId) {
  const user = getSessionUser();
  return user ? user.following.includes(targetId) : false;
}

/**
 * Update current user's profile fields.
 * Returns { success: boolean, error?: string }
 */
function updateProfile(username, bio, avatar) {
  const users = getUsers();
  const myId  = getSessionId();
  const idx   = users.findIndex(u => u.id === myId);
  if (idx === -1) return { success: false, error: 'User not found.' };

  const trimName = username.trim();
  if (!trimName)  return { success: false, error: 'Username cannot be empty.' };

  const taken = users.some((u, i) =>
    i !== idx && u.username.toLowerCase() === trimName.toLowerCase()
  );
  if (taken) return { success: false, error: 'Username already taken.' };

  users[idx].username = trimName;
  users[idx].bio      = bio.trim();
  users[idx].avatar   = avatar.trim();
  saveUsers(users);
  return { success: true };
}


/* ============================================================
   -8  UTILITY FUNCTIONS
============================================================ */

/**
 * Convert an ISO timestamp to a human-readable relative string.
 * Examples: "just now", "5m ago", "3h ago", "2d ago", "Mar 5, 2025"
 */
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 10)  return 'just now';
  if (s < 60)  return s + 's ago';
  const m = Math.floor(s / 60);
  if (m < 60)  return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24)  return h + 'h ago';
  const d = Math.floor(h / 24);
  if (d < 30)  return d + 'd ago';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Escape HTML special characters.
 * ALWAYS use this before inserting user-generated content via innerHTML.
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Gradient pool for avatar backgrounds */
const GRADIENTS = [
  'linear-gradient(135deg,#6366F1,#EC4899)',
  'linear-gradient(135deg,#10B981,#3B82F6)',
  'linear-gradient(135deg,#F59E0B,#EF4444)',
  'linear-gradient(135deg,#8B5CF6,#06B6D4)',
  'linear-gradient(135deg,#14B8A6,#6366F1)',
  'linear-gradient(135deg,#F97316,#A855F7)'
];

/** Return a consistent gradient for a given user ID */
function avatarGradient(userId) {
  const sum = [...String(userId)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

/**
 * Build an avatar <div> HTML string.
 * sizeClass: 'av-sm' | 'av-md' | 'av-lg' | 'av-xl'
 * When the user has an avatar URL the img covers the initials.
 * If the img fails to load (onerror) it removes itself, revealing initials.
 */
function makeAvatar(user, sizeClass = 'av-md') {
  const initials = esc(user.username.slice(0, 2).toUpperCase());
  const bg       = avatarGradient(user.id);

  if (user.avatar) {
    return `<div class="avatar ${sizeClass}" style="background:${bg}" title="${esc(user.username)}">`
         + initials
         + `<img src="${esc(user.avatar)}" alt="${esc(user.username)}" onerror="this.remove()">`
         + `</div>`;
  }
  return `<div class="avatar ${sizeClass}" style="background:${bg}" title="${esc(user.username)}">${initials}</div>`;
}


/* ============================================================
   -9  TOAST NOTIFICATION
============================================================ */

let _toastTimer = null;

/**
 * Show a brief bottom toast.
 * @param {string} msg  — message text
 * @param {number} ms   — display duration in milliseconds
 */
function toast(msg, ms = 2600) {
  const el   = document.getElementById('toast');
  const text = document.getElementById('toast-text');
  if (!el || !text) return;
  text.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}


/* ============================================================
   -10  VIEW MANAGEMENT  (SPA-style routing)
============================================================ */

let currentView      = 'feed';
let viewingProfileId = null;   // ID of profile currently shown

/**
 * Show one view, hide the others.
 * Accepted names: 'feed' | 'explore' | 'profile'
 */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-' + name);
  if (el) el.classList.remove('hidden');
  currentView = name;

  /* Sync active state across both sidebar and mobile nav */
  document.querySelectorAll('[data-view]').forEach(lnk => {
    lnk.classList.toggle('active', lnk.dataset.view === name);
  });

  /* Render the selected view */
  if (name === 'feed')    renderFeed();
  if (name === 'explore') renderExplore();
  if (name === 'profile') renderProfile(viewingProfileId || getSessionId());
}

/** Navigate to a specific user's profile */
function viewUserProfile(userId) {
  viewingProfileId = userId;
  showView('profile');
}

/** Show the auth section, hide the app */
function showAuthScreen() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('app-section').classList.add('hidden');
}

/** Show the app, hide auth; then boot the UI */
function showAppScreen() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('app-section').classList.remove('hidden');
  bootApp();
  showView('feed');
}


/* ============================================================
   -11  APP BOOTSTRAP
   Run once after every successful login / register.
============================================================ */

function bootApp() {
  const user = getSessionUser();
  if (!user) return;

  /* Sidebar user card */
  const card = document.getElementById('sidebar-user-card');
  if (card) {
    card.innerHTML =
      makeAvatar(user, 'av-sm')
      + `<div class="suc-info">`
      + `<div class="suc-name">${esc(user.username)}</div>`
      + `<div class="suc-handle">@${esc(user.username)}</div>`
      + `</div>`;
  }

  /* Create-post avatar */
  const cpav = document.getElementById('create-post-avatar');
  if (cpav) cpav.innerHTML = makeAvatar(user, 'av-md');

  /* Right sidebar suggestions */
  renderSuggestedUsers();
}


/* ============================================================
   -12  RENDER — FEED
============================================================ */

function renderFeed() {
  const container = document.getElementById('feed-posts');
  if (!container) return;

  const posts = getFeedPosts();
  const me    = getSessionUser();

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

  container.innerHTML = posts.map(p => buildPostCard(p, me)).join('');
}


/* ============================================================
   -13  RENDER — POST CARD  (reused in feed + profile)
============================================================ */

function buildPostCard(post, me) {
  const author     = findUserById(post.authorId);
  if (!author) return '';

  const liked      = post.likes.includes(me.id);
  const isOwner    = post.authorId === me.id;
  const likeCount  = post.likes.length;
  const cmtCount   = post.comments.length;

  const likeIcon = `<svg viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;

  const cmtIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
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
      <div class="post-author-info" onclick="viewUserProfile('${author.id}')">
        ${makeAvatar(author, 'av-sm')}
        <div>
          <div class="post-author-name">${esc(author.username)}</div>
          <div class="post-timestamp">${timeAgo(post.createdAt)}</div>
        </div>
      </div>
    </div>

    <p class="post-body" onclick="openPostModal('${post.id}')">${esc(post.content)}</p>

    <div class="post-footer">
      <button class="post-btn btn-like ${liked ? 'liked' : ''}"
              onclick="handleLike('${post.id}', this)"
              aria-label="Like post">
        ${likeIcon}
        <span>${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>

      <button class="post-btn btn-comment"
              onclick="openPostModal('${post.id}')"
              aria-label="View comments">
        ${cmtIcon}
        <span>${cmtCount} ${cmtCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>

      ${isOwner
        ? `<button class="post-btn btn-delete"
                   onclick="handleDelete('${post.id}')"
                   aria-label="Delete post">
             ${trashIcon}
             <span>Delete</span>
           </button>`
        : ''}
    </div>

  </div>
</article>`;
}


/* ============================================================
   -14  POST ACTIONS  (like, delete, create)
============================================================ */

/**
 * Toggle like on a post and update the button UI in place.
 * Called via onclick from the post card HTML.
 */
function handleLike(postId, btn) {
  const updated = toggleLike(postId);
  if (!updated) return;

  const me    = getSessionUser();
  const liked = updated.likes.includes(me.id);
  const count = updated.likes.length;

  /* Update the clicked button */
  btn.classList.toggle('liked', liked);
  const svg  = btn.querySelector('svg');
  if (svg) svg.setAttribute('fill', liked ? 'currentColor' : 'none');
  const span = btn.querySelector('span');
  if (span) span.textContent = `${count} ${count === 1 ? 'Like' : 'Likes'}`;

  /* Also update any open modal's like button */
  const modalLikeBtn = document.querySelector('#post-modal-body .btn-like');
  if (modalLikeBtn) {
    modalLikeBtn.classList.toggle('liked', liked);
    const mSvg = modalLikeBtn.querySelector('svg');
    if (mSvg) mSvg.setAttribute('fill', liked ? 'currentColor' : 'none');
    const mSpan = modalLikeBtn.querySelector('span');
    if (mSpan) mSpan.textContent = `${count} ${count === 1 ? 'Like' : 'Likes'}`;
  }
}

/**
 * Delete a post after confirmation.
 * Removes the card from DOM or re-renders the active view.
 */
function handleDelete(postId) {
  if (!confirm('Delete this post? This cannot be undone.')) return;
  const ok = deletePost(postId);
  if (!ok) { toast('Could not delete post.'); return; }

  /* Remove card from current DOM without full re-render */
  const card = document.querySelector(`[data-post-id="${postId}"]`);
  if (card) card.remove();

  /* Re-render profile if it is currently visible */
  if (currentView === 'profile') renderProfile(viewingProfileId || getSessionId());

  closePostModal();
  toast('Post deleted.');
}

/**
 * Create a post from the textarea and prepend it to the feed.
 */
function handleCreatePost() {
  const ta      = document.getElementById('post-textarea');
  const content = ta ? ta.value.trim() : '';

  if (!content) { toast('Write something before posting!'); return; }

  const post = createPost(content);
  if (!post) return;

  ta.value = '';
  const cc = document.getElementById('char-count');
  if (cc) { cc.textContent = '0'; cc.parentElement.classList.remove('near-limit'); }

  /* Prepend new card to feed without full re-render */
  const feedList = document.getElementById('feed-posts');
  if (feedList) {
    /* Remove empty-state if present */
    const es = feedList.querySelector('.empty-state');
    if (es) feedList.innerHTML = '';

    const me   = getSessionUser();
    const div  = document.createElement('div');
    div.innerHTML = buildPostCard(post, me);
    feedList.insertBefore(div.firstElementChild, feedList.firstChild);
  }

  toast('Posted!');
}


/* ============================================================
   -15  POST DETAIL MODAL
============================================================ */

/**
 * Open the post modal, populate it with post details + comments.
 */
function openPostModal(postId) {
  const posts = getPosts();
  const post  = posts.find(p => p.id === postId);
  if (!post) return;

  const me     = getSessionUser();
  const author = findUserById(post.authorId);
  if (!author) return;

  const liked   = post.likes.includes(me.id);
  const isOwner = post.authorId === me.id;
  const lCount  = post.likes.length;

  const likeIcon = `<svg viewBox="0 0 24 24" fill="${liked ? 'currentColor' : 'none'}"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`;

  const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>`;

  const commentsHtml = post.comments.length
    ? post.comments.map(buildCommentItem).join('')
    : '<p class="no-comments">No comments yet — be the first!</p>';

  const body = document.getElementById('post-modal-body');
  body.innerHTML = `
    <!-- Author row -->
    <div class="modal-author-row"
         onclick="closePostModal(); viewUserProfile('${author.id}')">
      ${makeAvatar(author, 'av-md')}
      <div>
        <div class="modal-author-name">${esc(author.username)}</div>
        <div class="modal-author-time">${timeAgo(post.createdAt)}</div>
      </div>
    </div>

    <!-- Post text -->
    <p class="modal-post-text">${esc(post.content)}</p>

    <!-- Full date/time -->
    <div class="modal-meta">
      ${new Date(post.createdAt).toLocaleString('en-US',
          { weekday:'long', year:'numeric', month:'long', day:'numeric',
            hour:'2-digit', minute:'2-digit' })}
    </div>

    <!-- Like + delete actions -->
    <div class="modal-actions">
      <button class="post-btn btn-like ${liked ? 'liked' : ''}"
              onclick="handleLike('${post.id}', this)"
              aria-label="Like">
        ${likeIcon}
        <span>${lCount} ${lCount === 1 ? 'Like' : 'Likes'}</span>
      </button>
      ${isOwner
        ? `<button class="post-btn btn-delete"
                   onclick="handleDelete('${post.id}')"
                   aria-label="Delete post">
             ${trashIcon}
             <span>Delete</span>
           </button>`
        : ''}
    </div>

    <!-- Comments heading -->
    <div class="comments-title">
      ${post.comments.length} ${post.comments.length === 1 ? 'Comment' : 'Comments'}
    </div>

    <!-- New comment input -->
    <div class="comment-input-row">
      ${makeAvatar(me, 'av-sm')}
      <textarea id="modal-comment-input"
                placeholder="Write a comment…"
                rows="2"
                aria-label="Comment text"></textarea>
      <button class="btn btn-primary btn-sm"
              onclick="handleAddComment('${post.id}')">Post</button>
    </div>

    <!-- Existing comments -->
    <div class="comments-list" id="modal-comments-list">
      ${commentsHtml}
    </div>`;

  document.getElementById('post-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePostModal() {
  document.getElementById('post-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

/** Render one comment item */
function buildCommentItem(comment) {
  const author = findUserById(comment.authorId);
  if (!author) return '';
  return `
<div class="comment-item">
  ${makeAvatar(author, 'av-sm')}
  <div class="comment-bubble">
    <span class="comment-author"
          onclick="closePostModal(); viewUserProfile('${author.id}')">
      ${esc(author.username)}
    </span>
    <p class="comment-text">${esc(comment.content)}</p>
    <div class="comment-time">${timeAgo(comment.createdAt)}</div>
  </div>
</div>`;
}

/**
 * Submit a comment from the modal textarea.
 * Updates the DOM without closing the modal.
 */
function handleAddComment(postId) {
  const ta      = document.getElementById('modal-comment-input');
  const content = ta ? ta.value.trim() : '';
  if (!content) { toast('Write a comment first!'); return; }

  const comment = addComment(postId, content);
  if (!comment) return;
  ta.value = '';

  /* Update comment count heading */
  const posts   = getPosts();
  const post    = posts.find(p => p.id === postId);
  const total   = post ? post.comments.length : 1;
  const heading = document.querySelector('#post-modal-body .comments-title');
  if (heading) heading.textContent = `${total} ${total === 1 ? 'Comment' : 'Comments'}`;

  /* Append new comment to list */
  const list = document.getElementById('modal-comments-list');
  if (list) {
    const noCmt = list.querySelector('.no-comments');
    if (noCmt) noCmt.remove();
    list.insertAdjacentHTML('beforeend', buildCommentItem(comment));
    list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* Update comment count badge on the feed card */
  const feedCmtSpan = document.querySelector(
    `[data-post-id="${postId}"] .btn-comment span`
  );
  if (feedCmtSpan)
    feedCmtSpan.textContent = `${total} ${total === 1 ? 'Comment' : 'Comments'}`;

  toast('Comment added!');
}


/* ============================================================
   -16  RENDER — EXPLORE VIEW
============================================================ */

function renderExplore(searchTerm = '') {
  const container = document.getElementById('explore-grid');
  if (!container) return;

  const me   = getSessionUser();
  let users  = getUsers().filter(u => u.id !== me.id);

  /* Filter by search term */
  if (searchTerm.trim()) {
    const q = searchTerm.trim().toLowerCase();
    users = users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    );
  }

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

  container.innerHTML = users.map(u => buildUserCard(u)).join('');
}

function buildUserCard(user) {
  const following  = isFollowing(user.id);
  const postCount  = getPostsByUser(user.id).length;

  return `
<div class="user-card" role="listitem">
  <div onclick="viewUserProfile('${user.id}')" style="cursor:pointer">
    ${makeAvatar(user, 'av-lg')}
  </div>
  <div class="uc-name" onclick="viewUserProfile('${user.id}')">${esc(user.username)}</div>
  <div class="uc-bio">${esc(user.bio || 'No bio yet.')}</div>
  <div class="uc-stats">
    <div class="stat-item">
      <span class="stat-number">${postCount}</span>
      <span class="stat-label">Posts</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">${user.followers.length}</span>
      <span class="stat-label">Followers</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">${user.following.length}</span>
      <span class="stat-label">Following</span>
    </div>
  </div>
  <button class="btn btn-sm ${following ? 'btn-outline' : 'btn-primary'}"
          onclick="handleFollow('${user.id}', this)">
    ${following ? 'Unfollow' : 'Follow'}
  </button>
</div>`;
}


/* ============================================================
   -17  RENDER — PROFILE VIEW
============================================================ */

function renderProfile(userId) {
  const container = document.getElementById('profile-container');
  if (!container) return;

  const user = findUserById(userId);
  if (!user) { container.innerHTML = '<div class="empty-state"><h3>User not found</h3></div>'; return; }

  const me         = getSessionUser();
  const isMe       = userId === me.id;
  const following  = isFollowing(userId);
  const posts      = getPostsByUser(userId);
  const postCount  = posts.length;

  container.innerHTML = `
    <!-- Profile header card -->
    <div class="profile-card">
      <div class="profile-banner"></div>
      <div class="profile-info-area">

        <div class="profile-avatar-wrap">
          ${makeAvatar(user, 'av-xl')}
        </div>

        <div class="profile-username">${esc(user.username)}</div>
        <div class="profile-handle">@${esc(user.username)}</div>

        <p class="profile-bio">
          ${user.bio ? esc(user.bio) : '<em style="color:var(--text-muted)">No bio yet.</em>'}
        </p>

        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-number">${postCount}</span>
            <span class="stat-label">Posts</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${user.followers.length}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">${user.following.length}</span>
            <span class="stat-label">Following</span>
          </div>
        </div>

        <div class="profile-actions">
          ${isMe
            ? `<button class="btn btn-outline btn-sm"
                       onclick="openEditModal()">Edit Profile</button>`
            : `<button class="btn btn-sm ${following ? 'btn-outline' : 'btn-primary'}"
                       id="profile-follow-btn"
                       onclick="handleFollow('${user.id}', document.getElementById('profile-follow-btn'))">
                 ${following ? 'Unfollow' : 'Follow'}
               </button>`}
        </div>

      </div>
    </div>

    <!-- Posts by this user -->
    <div class="profile-posts-label">
      ${isMe ? 'Your Posts' : esc(user.username) + '\'s Posts'} (${postCount})
    </div>
    <div class="posts-list" id="profile-posts-list">
      ${postCount
        ? posts.map(p => buildPostCard(p, me)).join('')
        : `<div class="empty-state">
             <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
               <polyline points="14 2 14 8 20 8"/>
             </svg>
             <h3>No posts yet</h3>
             <p>${isMe ? 'Create your first post from Home!' : 'Nothing posted yet.'}</p>
           </div>`}
    </div>`;
}


/* ============================================================
   -18  FOLLOW / UNFOLLOW
============================================================ */

/**
 * Toggle follow for a user and update the button text in-place.
 * Called from user cards, profile page, and suggested users panel.
 */
function handleFollow(targetId, btn) {
  const result = toggleFollow(targetId);
  if (!result) return;

  const { nowFollowing } = result;
  const targetUser = findUserById(targetId);

  /* Update the button */
  if (btn) {
    btn.textContent = nowFollowing ? 'Unfollow' : 'Follow';
    btn.classList.toggle('btn-primary', !nowFollowing);
    btn.classList.toggle('btn-outline',  nowFollowing);
  }

  /* Re-render suggested users (follow counts change) */
  renderSuggestedUsers();

  /* If we're on the feed, refresh it */
  if (currentView === 'feed') renderFeed();

  toast(nowFollowing
    ? `Following ${targetUser ? targetUser.username : 'user'}`
    : 'Unfollowed');
}


/* ============================================================
   -19  RIGHT SIDEBAR — SUGGESTED USERS
============================================================ */

function renderSuggestedUsers() {
  const container = document.getElementById('suggested-users');
  if (!container) return;

  const me          = getSessionUser();
  const suggestions = getUsers()
    .filter(u => u.id !== me.id && !me.following.includes(u.id))
    .slice(0, 6);

  if (!suggestions.length) {
    container.innerHTML = `<p class="widget-text">You're following everyone!</p>`;
    return;
  }

  container.innerHTML = suggestions.map(u => `
    <div class="suggest-item">
      ${makeAvatar(u, 'av-sm')}
      <div class="suggest-info">
        <div class="suggest-name" onclick="viewUserProfile('${u.id}')">${esc(u.username)}</div>
        <div class="suggest-bio">${esc(u.bio || 'No bio')}</div>
      </div>
      <button class="btn btn-sm btn-primary"
              onclick="handleFollow('${u.id}', this)">Follow</button>
    </div>`).join('');
}


/* ============================================================
   -20  EDIT PROFILE MODAL
============================================================ */

function openEditModal() {
  const user = getSessionUser();
  if (!user) return;

  document.getElementById('edit-username').value = user.username;
  document.getElementById('edit-bio').value      = user.bio || '';
  document.getElementById('edit-avatar').value   = user.avatar || '';

  /* Clear previous errors */
  document.getElementById('err-edit-username').textContent = '';
  const alertEl = document.getElementById('alert-edit');
  alertEl.textContent = '';
  alertEl.className   = 'form-alert';

  document.getElementById('edit-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('edit-username').focus();
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function handleEditProfile(e) {
  e.preventDefault();

  const username = document.getElementById('edit-username').value;
  const bio      = document.getElementById('edit-bio').value;
  const avatar   = document.getElementById('edit-avatar').value;

  /* Clear old errors */
  document.getElementById('err-edit-username').textContent = '';
  const alertEl = document.getElementById('alert-edit');
  alertEl.textContent = ''; alertEl.className = 'form-alert';

  const result = updateProfile(username, bio, avatar);

  if (!result.success) {
    alertEl.textContent = result.error;
    alertEl.className = 'form-alert error';
    return;
  }

  closeEditModal();
  bootApp();
  renderProfile(getSessionId());
  toast('Profile updated!');
}


/* ============================================================
   -21  AUTH UI HANDLERS
============================================================ */

/** Switch between Login and Register tabs */
function switchTab(name) {
  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');

  if (name === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

/** Handle login form submit */
function handleLogin(e) {
  e.preventDefault();

  const email    = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const alertEl  = document.getElementById('alert-login');

  alertEl.textContent = '';
  alertEl.className = 'form-alert';

  if (!email.trim()) {
    showFieldError('err-login-email', 'Email is required.');
    return;
  }
  if (!password.trim()) {
    showFieldError('err-login-password', 'Password is required.');
    return;
  }

  const result = loginUser(email, password);

  if (!result.success) {
    alertEl.textContent = result.error;
    alertEl.className = 'form-alert error';
    return;
  }

  showAppScreen();
}

/** Handle register form submit */
function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('reg-username').value;
  const email    = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const alertEl  = document.getElementById('alert-register');

  /* Clear all field errors */
  ['err-reg-username', 'err-reg-email', 'err-reg-password', 'err-reg-confirm']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = '';
      }
    });
  alertEl.textContent = '';
  alertEl.className = 'form-alert';

  const { valid, errors } = validateRegister(username, email, password, confirm);

  if (!valid) {
    if (errors.username) {
      showFieldError('err-reg-username', errors.username);
    }
    if (errors.email) {
      showFieldError('err-reg-email', errors.email);
    }
    if (errors.password) {
      showFieldError('err-reg-password', errors.password);
    }
    if (errors.confirm) {
      showFieldError('err-reg-confirm', errors.confirm);
    }
    return;
  }

  const newUser = registerUser(username, email, password);
  setSession(newUser.id);
  showAppScreen();
  toast('Welcome to Twizzle!');
}

/** Display an inline field validation error */
function showFieldError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}


/* ============================================================
   -22  EVENT LISTENERS
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Initialise seed data & restore session ── */
  initSeedData();

  if (getSessionId()) {
    showAppScreen();
  } else {
    showAuthScreen();
  }

  /* ────────────────────────────────────────────
     AUTH
  ──────────────────────────────────────────── */

  /* Tab switching */
  document.getElementById('tab-login')
    .addEventListener('click', () => switchTab('login'));
  document.getElementById('tab-register')
    .addEventListener('click', () => switchTab('register'));
  document.getElementById('link-go-register')
    .addEventListener('click', e => { e.preventDefault(); switchTab('register'); });
  document.getElementById('link-go-login')
    .addEventListener('click', e => { e.preventDefault(); switchTab('login'); });

  /* Form submits */
  document.getElementById('login-form')
    .addEventListener('submit', handleLogin);
  document.getElementById('register-form')
    .addEventListener('submit', handleRegister);

  /* Logout */
  document.getElementById('logout-btn')
    .addEventListener('click', logoutUser);

  /* ────────────────────────────────────────────
     NAVIGATION  (sidebar + mobile nav)
  ──────────────────────────────────────────── */

  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const view = el.dataset.view;
      if (view === 'profile') {
        viewingProfileId = getSessionId();  // always own profile via nav
        showView('profile');
      } else {
        showView(view);
      }
    });
  });

  /* ────────────────────────────────────────────
     CREATE POST
  ──────────────────────────────────────────── */

  document.getElementById('btn-submit-post')
    .addEventListener('click', handleCreatePost);

  /* Character counter */
  document.getElementById('post-textarea')
    .addEventListener('input', function () {
      const count = this.value.length;
      const cc    = document.getElementById('char-count');
      if (cc) {
        cc.textContent = count;
        cc.parentElement.classList.toggle('near-limit', count > 250);
      }
    });

  /* Ctrl/Cmd + Enter to post */
  document.getElementById('post-textarea')
    .addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleCreatePost();
    });

  /* ────────────────────────────────────────────
     POST MODAL
  ──────────────────────────────────────────── */

  document.getElementById('btn-close-post-modal')
    .addEventListener('click', closePostModal);
  document.getElementById('post-modal-backdrop')
    .addEventListener('click', closePostModal);

  /* ────────────────────────────────────────────
     EDIT PROFILE MODAL
  ──────────────────────────────────────────── */

  document.getElementById('btn-close-edit-modal')
    .addEventListener('click', closeEditModal);
  document.getElementById('edit-modal-backdrop')
    .addEventListener('click', closeEditModal);
  document.getElementById('btn-cancel-edit')
    .addEventListener('click', closeEditModal);
  document.getElementById('edit-profile-form')
    .addEventListener('submit', handleEditProfile);

  /* ────────────────────────────────────────────
     EXPLORE SEARCH
  ──────────────────────────────────────────── */

  document.getElementById('search-input')
    .addEventListener('input', e => renderExplore(e.target.value));

  /* ────────────────────────────────────────────
     KEYBOARD SHORTCUTS
  ──────────────────────────────────────────── */

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closePostModal();
      closeEditModal();
    }
  });

});