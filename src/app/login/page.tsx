'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    await signIn('credentials', {
      username: (formData.get('username') as string) || username,
      password: (formData.get('password') as string) || password,
      redirect: true,
      callbackUrl: '/',
    });

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-light-secondary dark:bg-dark-secondary p-8 shadow-sm shadow-light-200/10 dark:shadow-black/25">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-medium text-black/70 dark:text-white/70">
          Perplexica
        </h1>
        <p className="text-sm text-black/50 dark:text-white/50 mt-1">
          Sign in to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-500">
          Invalid username or password
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-sm text-black/60 dark:text-white/60"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
            placeholder="Enter your username"
            required
            autoComplete="username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm text-black/60 dark:text-white/60"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm text-black/70 dark:text-white/70 outline-none placeholder:text-black/30 dark:placeholder:text-white/30 focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition duration-200"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-lg bg-light-200 dark:bg-dark-200 px-4 py-2.5 text-sm font-medium text-black/70 dark:text-white/70 hover:opacity-70 hover:scale-[1.02] active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="flex h-full items-center justify-center bg-light-primary dark:bg-dark-primary">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
