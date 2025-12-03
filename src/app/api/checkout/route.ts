// POST /api/checkout - Create order and initiate payment
import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/orderService';
import { checkoutSchema, validateInput, formatValidationErrors } from '@/utils/validate';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateInput(checkoutSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          errors: formatValidationErrors(validation.errors!),
        },
        { status: 400 }
      );
    }

    const { fullName, email, whatsapp, storeName, templateKey, planType } = validation.data!;

    // Create order
    const result = await orderService.createOrder({
      full_name: fullName,
      email,
      whatsapp,
      store_name: storeName,
      template_key: templateKey,
      plan_type: planType,
      amount: 0, // Will be calculated by service based on plan
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      paymentUrl: result.paymentUrl,
    });
  } catch (error) {
    logger.error('Checkout API error', error);
    return NextResponse.json(
      { success: false, error: 'Ralat pelayan dalaman' },
      { status: 500 }
    );
  }
}
