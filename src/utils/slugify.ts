/**
 * Generate URL-friendly slug from string
 * Handles Malay characters and special cases
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace Malay special characters
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug with random suffix
 */
export function generateUniqueSlug(text: string): string {
  const baseSlug = slugify(text);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Check if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Slug must be 3-100 characters, lowercase alphanumeric with hyphens
  const slugRegex = /^[a-z0-9][a-z0-9-]{1,98}[a-z0-9]$/;
  return slugRegex.test(slug) && !slug.includes('--');
}

/**
 * Generate order number
 * Format: KD-YYYYMMDD-XXXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `KD-${dateStr}-${random}`;
}
