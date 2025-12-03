// GET /api/stores/[slug] - Get store by slug (public)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get store with products
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          compare_price,
          images_json,
          variants_json,
          category,
          stock_quantity,
          sort_order
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }

    // Sort products by sort_order
    if (store.products) {
      store.products.sort((a: any, b: any) => a.sort_order - b.sort_order);
    }

    return NextResponse.json({
      success: true,
      store,
    });
  } catch (error) {
    logger.error('Get store API error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}
