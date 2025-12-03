import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface IdempotencyRecord {
  key: string;
  response: unknown;
  created_at: string;
}

/**
 * Check if a request has already been processed
 * Used to prevent duplicate webhook processing
 */
export async function checkIdempotency(
  provider: string,
  eventId: string
): Promise<{ isDuplicate: boolean; existingResponse?: unknown }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('webhook_logs')
      .select('id, processed, raw_payload')
      .eq('provider', provider)
      .eq('provider_event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      logger.error('Idempotency check failed', error);
      throw error;
    }

    if (data && data.processed) {
      return { isDuplicate: true, existingResponse: data.raw_payload };
    }

    return { isDuplicate: false };
  } catch (error) {
    logger.error('Idempotency check error', error);
    return { isDuplicate: false };
  }
}

/**
 * Record a webhook event for idempotency
 */
export async function recordWebhookEvent(
  provider: string,
  eventId: string,
  payload: unknown,
  endpoint: string
): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('webhook_logs')
      .insert({
        provider,
        provider_event_id: eventId,
        endpoint,
        raw_payload: payload,
        processed: false,
      })
      .select('id')
      .single();

    if (error) {
      // If duplicate key error, it means webhook already logged
      if (error.code === '23505') {
        logger.warn('Duplicate webhook event', { provider, eventId });
        return null;
      }
      throw error;
    }

    return data.id;
  } catch (error) {
    logger.error('Failed to record webhook event', error);
    return null;
  }
}

/**
 * Mark webhook as processed
 */
export async function markWebhookProcessed(
  webhookLogId: string,
  errorMessage?: string
): Promise<void> {
  try {
    await supabaseAdmin
      .from('webhook_logs')
      .update({
        processed: true,
        error_message: errorMessage || null,
      })
      .eq('id', webhookLogId);
  } catch (error) {
    logger.error('Failed to mark webhook as processed', error);
  }
}

/**
 * Generate idempotency key from request data
 */
export function generateIdempotencyKey(...parts: string[]): string {
  return parts.filter(Boolean).join(':');
}
