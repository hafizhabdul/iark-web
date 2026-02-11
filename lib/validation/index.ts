/**
 * Server-side validation utilities
 * Use these to validate form data before processing
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Email regex (basic but covers most cases)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex (Indonesian format, flexible)
const PHONE_REGEX = /^(\+62|62|0)?[0-9]{9,13}$/;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate phone number (Indonesian format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces and dashes for validation
  const cleaned = phone.replace(/[\s-]/g, '');
  return PHONE_REGEX.test(cleaned);
}

/**
 * Sanitize string input (trim, remove HTML tags)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove remaining angle brackets
}

/**
 * Validate required string field
 */
export function isNonEmpty(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate string length
 */
export function isWithinLength(
  value: string,
  min: number,
  max: number
): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

/**
 * Validate positive integer
 */
export function isPositiveInteger(value: number | string): boolean {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num > 0;
}

/**
 * Validate amount (for donations)
 */
export function isValidAmount(
  amount: number,
  min: number = 10000,
  max: number = 100000000
): boolean {
  return Number.isFinite(amount) && amount >= min && amount <= max;
}

// ============================================================================
// Form Validators
// ============================================================================

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone?: string;
  angkatan?: number;
  asrama?: string;
  organization?: string;
}

/**
 * Validate event registration form
 */
export function validateRegistrationForm(
  data: RegistrationFormData
): ValidationResult {
  const errors: Record<string, string> = {};

  // Full name: required, 2-100 chars
  if (!isNonEmpty(data.fullName)) {
    errors.fullName = 'Nama lengkap wajib diisi';
  } else if (!isWithinLength(data.fullName, 2, 100)) {
    errors.fullName = 'Nama harus 2-100 karakter';
  }

  // Email: required, valid format
  if (!isNonEmpty(data.email)) {
    errors.email = 'Email wajib diisi';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Format email tidak valid';
  }

  // Phone: optional, but if provided must be valid
  if (data.phone && data.phone.trim() && !isValidPhone(data.phone)) {
    errors.phone = 'Format nomor telepon tidak valid';
  }

  // Angkatan: optional, but if provided must be valid year
  if (data.angkatan !== undefined && data.angkatan !== null) {
    const year = Number(data.angkatan);
    if (!Number.isInteger(year) || year < 2000 || year > 2030) {
      errors.angkatan = 'Angkatan harus tahun valid (2000-2030)';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export interface DonationFormData {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  isAnonymous?: boolean;
  message?: string;
}

/**
 * Validate donation form
 */
export function validateDonationForm(
  data: DonationFormData
): ValidationResult {
  const errors: Record<string, string> = {};

  // Donor name: required if not anonymous
  if (!data.isAnonymous && !isNonEmpty(data.donorName)) {
    errors.donorName = 'Nama donatur wajib diisi';
  }

  // Email: required
  if (!isNonEmpty(data.donorEmail)) {
    errors.donorEmail = 'Email wajib diisi';
  } else if (!isValidEmail(data.donorEmail)) {
    errors.donorEmail = 'Format email tidak valid';
  }

  // Phone: optional validation
  if (data.donorPhone && data.donorPhone.trim() && !isValidPhone(data.donorPhone)) {
    errors.donorPhone = 'Format nomor telepon tidak valid';
  }

  // Amount: required, min 10k, max 100jt
  if (!isValidAmount(data.amount)) {
    errors.amount = 'Nominal donasi harus antara Rp 10.000 - Rp 100.000.000';
  }

  // Message: optional, max 500 chars
  if (data.message && data.message.length > 500) {
    errors.message = 'Pesan maksimal 500 karakter';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
