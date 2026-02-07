'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const AccountSection = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to change password.');
        return;
      }

      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 px-6 py-6">
      <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-black/50 dark:text-white/50">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
            placeholder="Enter current password"
            required
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-black/50 dark:text-white/50">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
            placeholder="Min 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-black/50 dark:text-white/50">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
            placeholder="Confirm new password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 self-start rounded-lg bg-light-200 dark:bg-dark-200 px-5 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:opacity-70 hover:scale-[1.02] active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default AccountSection;
