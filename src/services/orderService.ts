// Order Service - Business logic for orders
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { emailService } from '@/lib/email';
import { paymentService } from './payment';
import { deployService } from './deployService';
import { generateOrderNumber, generateUniqueSlug } from '@/utils/slugify';
import { sanitizePhoneNumber } from '@/utils/validate';
import type { Order, CreateOrderInput, OrderStatus, PlanType } from '@/models/order';
import type { CreateStoreInput } from '@/models/store';

// Pricing configuration - KEEP IN SYNC WITH constants.ts
// Beginner = RM19, Pro = RM59, Enterprise = RM99
const PRICING: Record<PlanType, number> = {
  free: 19,    // Beginner plan
  pro: 59,
  enterprise: 99,
};

class OrderService {
  /**
   * Create a new order and initiate payment
   */
  async createOrder(input: CreateOrderInput): Promise<{
    success: boolean;
    orderId?: string;
    orderNumber?: string;
    paymentUrl?: string;
    error?: string;
  }> {
    try {
      const orderNumber = generateOrderNumber();
      const storeSlug = generateUniqueSlug(input.store_name);
      const amount = PRICING[input.plan_type] || 0;
      const sanitizedPhone = sanitizePhoneNumber(input.whatsapp);

      // Create order in database
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          store_slug: storeSlug,
          full_name: input.full_name,
          email: input.email,
          whatsapp: sanitizedPhone,
          template_key: input.template_key,
          plan_type: input.plan_type,
          amount,
          status: 'pending' as OrderStatus,
          meta_json: {
            store_name: input.store_name,
          },
        })
        .select()
        .single();

      if (orderError) {
        logger.error('Failed to create order', orderError);
        throw new Error('Gagal mencipta pesanan');
      }

      logger.audit('order_created', {
        orderId: order.id,
        orderNumber,
        email: input.email,
        planType: input.plan_type,
        amount,
      });

      // If free plan, skip payment and go straight to deployment
      if (amount === 0) {
        await this.processFreePlan(order.id, orderNumber, input, storeSlug);
        
        const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${storeSlug}`;
        return {
          success: true,
          orderId: order.id,
          orderNumber,
          paymentUrl: storeUrl, // Redirect to store directly
        };
      }

      // Create payment bill
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const billResult = await paymentService.createBill({
        billName: `KEDAI - ${input.plan_type.toUpperCase()} Plan`,
        billDescription: `Langganan ${input.plan_type} untuk kedai ${input.store_name}`,
        billPriceSetting: 1,
        billPayorInfo: 1,
        billAmount: paymentService.formatAmount(amount),
        billReturnUrl: `${baseUrl}/thankyou?order=${orderNumber}`,
        billCallbackUrl: `${baseUrl}/api/webhooks/toyyibpay`,
        billExternalReferenceNo: order.id,
        billTo: input.full_name,
        billEmail: input.email,
        billPhone: sanitizedPhone,
      });

      if (!billResult.success) {
        // Update order status to failed
        await this.updateOrderStatus(order.id, 'failed');
        throw new Error(billResult.error || 'Gagal mencipta bil pembayaran');
      }

      // Update order with bill info
      await supabaseAdmin
        .from('orders')
        .update({
          toyyib_bill_code: billResult.billCode,
          payment_url: billResult.paymentUrl,
        })
        .eq('id', order.id);

      return {
        success: true,
        orderId: order.id,
        orderNumber,
        paymentUrl: billResult.paymentUrl,
      };
    } catch (error) {
      logger.error('Order creation failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ralat tidak diketahui',
      };
    }
  }

  /**
   * Process free plan - create store immediately
   */
  private async processFreePlan(
    orderId: string,
    orderNumber: string,
    input: CreateOrderInput,
    storeSlug: string
  ): Promise<void> {
    try {
      // Mark as paid (free)
      await this.updateOrderStatus(orderId, 'paid');
      await supabaseAdmin
        .from('orders')
        .update({ paid_at: new Date().toISOString() })
        .eq('id', orderId);

      // Create store
      await this.createStore(orderId, {
        slug: storeSlug,
        name: input.store_name,
        whatsapp: sanitizePhoneNumber(input.whatsapp),
        email: input.email,
        template_key: input.template_key,
        is_premium: false,
      });

      // Mark as completed
      await this.updateOrderStatus(orderId, 'completed');
      await supabaseAdmin
        .from('orders')
        .update({ deployed_at: new Date().toISOString() })
        .eq('id', orderId);

      logger.audit('free_plan_completed', { orderId, orderNumber, storeSlug });
    } catch (error) {
      logger.error('Free plan processing failed', error);
      await this.updateOrderStatus(orderId, 'failed');
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(orderId: string, toyyibRef: string): Promise<void> {
    try {
      // Get order details
      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      // Update order status
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          toyyib_ref: toyyibRef,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      logger.audit('payment_received', {
        orderId,
        orderNumber: order.order_number,
        amount: order.amount,
      });

      // Start deployment process
      await this.updateOrderStatus(orderId, 'deploying');
      
      // Create store
      const storeData: CreateStoreInput = {
        slug: order.store_slug,
        name: order.meta_json?.store_name || order.full_name,
        whatsapp: order.whatsapp,
        email: order.email,
        template_key: order.template_key,
        is_premium: order.plan_type !== 'free',
      };

      await this.createStore(orderId, storeData);

      // Trigger deployment/revalidation
      await deployService.triggerDeploy(order.store_slug);

      // Mark as completed
      await this.updateOrderStatus(orderId, 'completed');
      await supabaseAdmin
        .from('orders')
        .update({ deployed_at: new Date().toISOString() })
        .eq('id', orderId);

      // Send confirmation emails
      const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${order.store_slug}`;
      
      await emailService.sendOrderConfirmation({
        customerName: order.full_name,
        orderNumber: order.order_number,
        storeName: order.meta_json?.store_name || order.full_name,
        storeUrl,
        amount: order.amount,
        customerEmail: order.email,
      });

      await emailService.sendDeploymentComplete({
        storeName: order.meta_json?.store_name || order.full_name,
        storeUrl,
        customerEmail: order.email,
      });

      logger.audit('deployment_completed', {
        orderId,
        orderNumber: order.order_number,
        storeSlug: order.store_slug,
      });
    } catch (error) {
      logger.error('Payment success handling failed', error, { orderId });
      await this.updateOrderStatus(orderId, 'failed');
      throw error;
    }
  }

  /**
   * Create store in database
   */
  private async createStore(orderId: string, input: CreateStoreInput): Promise<void> {
    // Get template for theme
    const { data: template } = await supabaseAdmin
      .from('templates')
      .select('theme_json, sample_products_json')
      .eq('key', input.template_key)
      .single();

    const { error } = await supabaseAdmin.from('stores').insert({
      ...input,
      theme_json: template?.theme_json || {},
    });

    if (error) {
      logger.error('Failed to create store', error);
      throw new Error('Gagal mencipta kedai');
    }

    // Copy sample products from template
    if (template?.sample_products_json) {
      const { data: store } = await supabaseAdmin
        .from('stores')
        .select('id')
        .eq('slug', input.slug)
        .single();

      if (store) {
        const sampleProducts = template.sample_products_json.map((product: any, index: number) => ({
          store_id: store.id,
          name: product.name,
          price: product.price,
          images_json: [product.image],
          sort_order: index,
        }));

        await supabaseAdmin.from('products').insert(sampleProducts);
      }
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    logger.audit('order_status_updated', { orderId, status });
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      logger.error('Failed to get order', error);
      return null;
    }

    return data;
  }

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Get orders for admin
   */
  async getOrders(options: {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ orders: Order[]; total: number }> {
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      logger.error('Failed to get orders', error);
      return { orders: [], total: 0 };
    }

    return { orders: data || [], total: count || 0 };
  }
}

export const orderService = new OrderService();
