import { requireAdmin } from '@/lib/auth';
import db from '@/lib/db';
import { users, chats, messages } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await requireAdmin();
    if (!session) {
      return Response.json(
        { message: 'Forbidden' },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (id === (session.user as any).id) {
      return Response.json(
        { message: 'Cannot delete yourself' },
        { status: 400 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 },
      );
    }

    // CASCADE delete: messages -> chats -> user
    const userChats = await db.query.chats.findMany({
      where: eq(chats.userId, id),
    });

    const chatIds = userChats.map((c) => c.id);

    if (chatIds.length > 0) {
      await db.delete(messages).where(inArray(messages.chatId, chatIds)).execute();
      await db.delete(chats).where(eq(chats.userId, id)).execute();
    }

    await db.delete(users).where(eq(users.id, id)).execute();

    return Response.json(
      { message: 'User deleted successfully' },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error deleting user:', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
