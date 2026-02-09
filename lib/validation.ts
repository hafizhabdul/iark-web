/**
 * Shared validation functions for server-side and client-side use
 */

/**
 * Validate email format
 */
export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate Indonesian phone number
 * Accepts: 08xxx, +628xxx, 628xxx
 * Returns true for null/undefined (phone is usually optional)
 */
export function validatePhone(phone: string | null | undefined): boolean {
  if (phone === null || phone === undefined || phone === '') return true;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate name (minimum 2 characters, not just whitespace)
 */
export function validateName(name: string | null | undefined): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2;
}

/**
 * Validate amount (minimum value)
 */
export function validateAmount(amount: number, min = 10000): boolean {
  return typeof amount === 'number' && amount >= min;
}

/**
 * Sanitize input - trim whitespace and remove HTML tags
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Validate registration data
 */
export interface RegistrationData {
  fullName: string;
  email: string;
  phone?: string | null;
  angkatan?: string | null;
  asrama?: string | null;
  organization?: string | null;
}

export function validateRegistration(data: RegistrationData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateName(data.fullName)) {
    errors.push('Nama wajib diisi (minimal 2 karakter)');
  }

  if (!validateEmail(data.email)) {
    errors.push('Email tidak valid');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Nomor telepon tidak valid');
  }

  if (data.angkatan) {
    const angkatan = parseInt(data.angkatan);
    if (isNaN(angkatan) || angkatan < 1 || angkatan > 100) {
      errors.push('Angkatan tidak valid');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate donation data
 */
export interface DonationData {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string | null;
  message?: string | null;
}

export function validateDonation(data: DonationData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validateAmount(data.amount)) {
    errors.push('Minimal donasi Rp 10.000');
  }

  if (!validateName(data.donor_name)) {
    errors.push('Nama wajib diisi');
  }

  if (!validateEmail(data.donor_email)) {
    errors.push('Email tidak valid');
  }

  if (data.donor_phone && !validatePhone(data.donor_phone)) {
    errors.push('Nomor telepon tidak valid');
  }

  if (data.message && data.message.length > 500) {
    errors.push('Pesan maksimal 500 karakter');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
