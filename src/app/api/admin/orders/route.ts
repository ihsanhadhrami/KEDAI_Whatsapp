// GET /api/admin/orders - List orders for admin dashboard
// POST /api/admin/orders - Manual order operations
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { logger } from '@/lib/logger';
import type { OrderStatus } from '@/models/order';

// Simple admin auth check (replace with proper auth in production)
function isAdminAuthenticated(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret');
  return adminSecret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { orders, total } = await orderService.getOrders({
      status: status || undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + orders.length < total,
      },
    });
  } catch (error) {
    logger.error('Admin orders API error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, orderId } = body;

    switch (action) {
      case 'retry-deploy':
        const order = await orderService.getOrderById(orderId);
        if (!order) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        if (order.status !== 'paid' && order.status !== 'failed') {
          return NextResponse.json({ error: 'Order cannot be redeployed' }, { status: 400 });
        }
        await orderService.handlePaymentSuccess(orderId, order.toyyib_ref || '');
        return NextResponse.json({ success: true, message: 'Deployment retried' });

      case 'mark-refunded':
        await orderService.updateOrderStatus(orderId, 'refunded');
        return NextResponse.json({ success: true, message: 'Order marked as refunded' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    logger.error('Admin order action error', error);
    return NextResponse.json(
      { success: false, error: 'Action failed' },
      { status: 500 }
    );
  }
}
