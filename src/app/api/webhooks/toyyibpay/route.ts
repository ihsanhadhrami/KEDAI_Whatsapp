// POST /api/webhooks/toyyibpay - Handle ToyyibPay payment callbacks
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { paymentService, type WebhookPayload } from '@/services/payment';
import { checkIdempotency, recordWebhookEvent, markWebhookProcessed } from '@/utils/idempotency';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  let webhookLogId: string | null = null;

  try {
    // Parse webhook payload (ToyyibPay sends form-urlencoded or JSON)
    const contentType = request.headers.get('content-type') || '';
    let payload: WebhookPayload;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      payload = {
        refno: formData.get('refno') as string,
        status: formData.get('status') as string,
        reason: formData.get('reason') as string,
        billcode: formData.get('billcode') as string,
        order_id: formData.get('order_id') as string,
        amount: formData.get('amount') as string,
      };
    } else {
      payload = await request.json();
    }

    logger.info('ToyyibPay webhook received', { billcode: payload.billcode, status: payload.status });

    // Check idempotency using billcode + refno
    const idempotencyKey = `${payload.billcode}:${payload.refno}`;
    const { isDuplicate } = await checkIdempotency('toyyibpay', idempotencyKey);

    if (isDuplicate) {
      logger.info('Duplicate webhook ignored', { billcode: payload.billcode });
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Record webhook for logging
    webhookLogId = await recordWebhookEvent(
      'toyyibpay',
      idempotencyKey,
      payload,
      '/api/webhooks/toyyibpay'
    );

    // Verify webhook authenticity
    const verification = await paymentService.verifyWebhook(payload);
    if (!verification.isValid) {
      logger.warn('Webhook verification failed', { payload });
      if (webhookLogId) {
        await markWebhookProcessed(webhookLogId, 'Verification failed');
      }
      return NextResponse.json({ success: false, error: 'Invalid webhook' }, { status: 400 });
    }

    // Check payment status
    if (!paymentService.isPaymentSuccessful(payload.status)) {
      logger.info('Payment not successful', { status: payload.status, reason: payload.reason });
      if (webhookLogId) {
        await markWebhookProcessed(webhookLogId, `Payment failed: ${payload.reason}`);
      }
      return NextResponse.json({ success: true, message: 'Payment not successful' });
    }

    // Process successful payment
    const orderId = payload.order_id || verification.orderId;
    if (!orderId) {
      throw new Error('Order ID not found in webhook');
    }

    await orderService.handlePaymentSuccess(orderId, payload.refno);

    // Mark webhook as processed
    if (webhookLogId) {
      await markWebhookProcessed(webhookLogId);
    }

    logger.audit('payment_webhook_processed', {
      orderId,
      billcode: payload.billcode,
      refno: payload.refno,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('ToyyibPay webhook error', error);
    
    if (webhookLogId) {
      await markWebhookProcessed(
        webhookLogId,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    // Always return 200 to prevent retry flood
    // Log error for investigation
    return NextResponse.json({ success: false, error: 'Processing error' });
  }
}

// Handle GET for webhook verification (some gateways ping the URL)
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}
