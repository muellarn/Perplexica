import { requireAdmin } from '@/lib/auth';
import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export const GET = async () => {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json(
        { message: 'Forbidden' },
        { status: 403 },
      );
    }

    const allUsers = await db.query.users.findMany();

    const sorted = allUsers
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map(({ passwordHash, ...user }) => user);

    return Response.json({ users: sorted }, { status: 200 });
  } catch (err) {
    console.error('Error listing users:', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json(
        { message: 'Forbidden' },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { username, password } = body as {
      username: string;
      password: string;
    };

    if (!username || !username.trim()) {
      return Response.json(
        { message: 'Username is required' },
        { status: 400 },
      );
    }

    if (!password || password.length < 8) {
      return Response.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.username, username.trim()),
    });

    if (existing) {
      return Response.json(
        { message: 'Username already exists' },
        { status: 409 },
      );
    }

    const id = crypto.randomUUID();
    const passwordHash = bcryptjs.hashSync(password, 12);
    const createdAt = new Date().toISOString();

    await db.insert(users).values({
      id,
      username: username.trim(),
      passwordHash,
      role: 'user',
      createdAt,
    });

    return Response.json(
      { id, username: username.trim(), role: 'user', createdAt },
      { status: 201 },
    );
  } catch (err) {
    console.error('Error creating user:', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
