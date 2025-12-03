// POST /api/admin/deploy - Manual deployment trigger
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { deployService } from '@/services/deployService';
import { logger } from '@/lib/logger';

function isAdminAuthenticated(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret');
  return adminSecret === process.env.ADMIN_SECRET;
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, storeSlug, fullDeploy } = body;

    // If orderId provided, get store slug from order
    let slug = storeSlug;
    if (orderId) {
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      slug = order.store_slug;
    }

    if (!slug && !fullDeploy) {
      return NextResponse.json({ error: 'Store slug or orderId required' }, { status: 400 });
    }

    let success: boolean;
    if (fullDeploy) {
      success = await deployService.triggerFullDeploy();
    } else {
      success = await deployService.triggerDeploy(slug);
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Deployment trigger failed' },
        { status: 500 }
      );
    }

    logger.audit('manual_deploy_triggered', { orderId, storeSlug: slug, fullDeploy });

    return NextResponse.json({
      success: true,
      message: fullDeploy ? 'Full deployment triggered' : `Deployment triggered for ${slug}`,
    });
  } catch (error) {
    logger.error('Manual deploy error', error);
    return NextResponse.json(
      { success: false, error: 'Deployment failed' },
      { status: 500 }
    );
  }
}
