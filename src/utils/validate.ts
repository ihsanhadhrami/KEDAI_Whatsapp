import { z } from 'zod';

// Checkout validation schema
export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Nama mesti sekurang-kurangnya 2 aksara').max(100),
  email: z.string().email('Email tidak sah'),
  whatsapp: z
    .string()
    .min(10, 'Nombor WhatsApp tidak sah')
    .max(15)
    .regex(/^[0-9+]+$/, 'Nombor WhatsApp hanya boleh mengandungi nombor'),
  storeName: z.string().min(2, 'Nama kedai mesti sekurang-kurangnya 2 aksara').max(100),
  templateKey: z.string().min(1, 'Sila pilih templat'),
  planType: z.enum(['free', 'pro', 'enterprise']).default('free'),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// Store validation schema
export const storeSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  whatsapp: z.string().min(10).max(15),
  email: z.string().email().optional(),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().min(0),
  comparePrice: z.number().min(0).optional(),
  category: z.string().max(100).optional(),
  stockQuantity: z.number().int().min(0).default(0),
});

// Validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: z.ZodError['errors'];
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.errors };
}

// Format validation errors for API response
export function formatValidationErrors(errors: z.ZodError['errors']): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const error of errors) {
    const path = error.path.join('.');
    formatted[path] = error.message;
  }
  return formatted;
}

// Sanitize phone number (Malaysia format)
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^0-9+]/g, '');
  
  // Convert 0 prefix to +60
  if (cleaned.startsWith('0')) {
    cleaned = '+60' + cleaned.slice(1);
  }
  
  // Add +60 if no country code
  if (!cleaned.startsWith('+')) {
    cleaned = '+60' + cleaned;
  }
  
  return cleaned;
}

// Validate Malaysian phone number
export function isValidMalaysianPhone(phone: string): boolean {
  const cleaned = sanitizePhoneNumber(phone);
  // Malaysian mobile: +60 1X-XXX XXXX (10-11 digits after +60)
  const mobileRegex = /^\+60[1][0-9]{8,9}$/;
  return mobileRegex.test(cleaned);
}
