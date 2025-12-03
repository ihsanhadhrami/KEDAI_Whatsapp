// POST /api/revalidate - On-demand ISR revalidation for store pages
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const secret = request.headers.get('x-revalidate-secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, path } = body;

    if (slug) {
      // Revalidate specific store page
      revalidatePath(`/${slug}`);
      logger.info('Revalidated store page', { slug });
    } else if (path) {
      // Revalidate specific path
      revalidatePath(path);
      logger.info('Revalidated path', { path });
    } else {
      // Revalidate all store pages
      revalidatePath('/[store]', 'page');
      logger.info('Revalidated all store pages');
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: true,
      timestamp: Date.now(),
    });
  } catch (error) {
    logger.error('Revalidation error', error);
    return NextResponse.json(
      { success: false, error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
