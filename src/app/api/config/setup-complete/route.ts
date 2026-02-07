import configManager from '@/lib/config';
import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export const POST = async (req: NextRequest) => {
  const session = await requireAdmin();
  if (!session) {
    return Response.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    configManager.markSetupComplete();

    return Response.json(
      {
        message: 'Setup marked as complete.',
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error('Error marking setup as complete: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
