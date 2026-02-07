'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trash2, Plus, Shield } from 'lucide-react';

interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

const AdminUsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 403) {
        router.push('/');
        return;
      }
      const data = await res.json();
      setUsers(data.users);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.message });
        return;
      }

      setUsers((prev) => [data, ...prev]);
      setUsername('');
      setPassword('');
      setFeedback({
        type: 'success',
        message: `User "${data.username}" created`,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to create user' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        `Delete user "${user.username}"? This will remove all their chats and messages.`,
      )
    ) {
      return;
    }

    setDeletingId(user.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', message: data.message });
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setFeedback({
        type: 'success',
        message: `User "${user.username}" deleted`,
      });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete user' });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex flex-col pt-10 border-b border-light-200/20 dark:border-dark-200/20 pb-6 px-2">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div className="flex items-center justify-center">
            <Users size={45} className="mb-2.5" />
            <div className="flex flex-col">
              <h1
                className="text-5xl font-normal p-2 pb-0"
                style={{ fontFamily: 'PP Editorial, serif' }}
              >
                Users
              </h1>
              <div className="px-2 text-sm text-black/60 dark:text-white/60 text-center lg:text-left">
                Manage user accounts and access.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end gap-2 text-xs text-black/60 dark:text-white/60">
            <span className="inline-flex items-center gap-1 rounded-full border border-black/20 dark:border-white/20 px-2 py-0.5">
              <Users size={14} />
              {loading
                ? 'Loading\u2026'
                : `${users.length} ${users.length === 1 ? 'user' : 'users'}`}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6 pb-28 px-2">
        <div className="rounded-2xl border border-light-200 dark:border-dark-200 overflow-hidden bg-light-secondary dark:bg-dark-secondary p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={16} className="text-black/70 dark:text-white/70" />
            <h2 className="text-sm font-medium text-black/70 dark:text-white/70">
              Add User
            </h2>
          </div>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label
                htmlFor="new-username"
                className="text-xs text-black/50 dark:text-white/50"
              >
                Username
              </label>
              <input
                id="new-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
                placeholder="Enter username"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label
                htmlFor="new-password"
                className="text-xs text-black/50 dark:text-white/50"
              >
                Password
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
                placeholder="Min 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-light-200 dark:bg-dark-200 px-5 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:opacity-70 hover:scale-[1.02] active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {creating ? 'Creating\u2026' : 'Add User'}
              </button>
            </div>
          </form>
        </div>

        {feedback && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              feedback.type === 'success'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {loading ? (
          <div className="flex flex-row items-center justify-center min-h-[40vh]">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] px-2 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-light-200 dark:border-dark-200 bg-light-secondary dark:bg-dark-secondary">
              <Users className="text-black/70 dark:text-white/70" />
            </div>
            <p className="mt-2 text-black/70 dark:text-white/70 text-sm">
              No users found.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-light-200 dark:border-dark-200 overflow-hidden bg-light-primary dark:bg-dark-primary">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={
                  'group flex items-center justify-between gap-3 p-4 hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-200 ' +
                  (index !== users.length - 1
                    ? 'border-b border-light-200 dark:border-dark-200'
                    : '')
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-amber-500/15 text-amber-500'
                        : 'bg-light-200 dark:bg-dark-200 text-black/50 dark:text-white/50'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Shield size={15} />
                    ) : (
                      <Users size={15} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-black dark:text-white truncate">
                        {user.username}
                      </p>
                      {user.role === 'admin' && (
                        <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">
                          admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      Created {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(user)}
                  disabled={user.role === 'admin' || deletingId === user.id}
                  className={`shrink-0 p-2 rounded-lg transition duration-200 ${
                    user.role === 'admin'
                      ? 'opacity-20 cursor-not-allowed text-black/50 dark:text-white/50'
                      : deletingId === user.id
                        ? 'opacity-50 cursor-not-allowed text-red-400'
                        : 'text-black/40 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 active:scale-95'
                  }`}
                  title={
                    user.role === 'admin'
                      ? 'Cannot delete admin'
                      : `Delete ${user.username}`
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
