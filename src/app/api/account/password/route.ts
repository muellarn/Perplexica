import { requireAuth } from '@/lib/auth';
import db from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

export const POST = async (req: Request) => {
  try {
    const session = await requireAuth();
    if (!session) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { currentPassword, newPassword } = (await req.json()) as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      return Response.json(
        { message: 'Current and new password are required' },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { message: 'New password must be at least 8 characters' },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const valid = await bcryptjs.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return Response.json(
        { message: 'Current password is incorrect' },
        { status: 403 },
      );
    }

    const newHash = bcryptjs.hashSync(newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, userId))
      .execute();

    return Response.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
