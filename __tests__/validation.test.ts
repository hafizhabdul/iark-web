import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateName, sanitizeInput } from '@/lib/validation';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.id')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('missing@domain')).toBe(false);
      expect(validateEmail('@nodomain.com')).toBe(false);
      expect(validateEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should accept valid Indonesian phone numbers', () => {
      expect(validatePhone('08123456789')).toBe(true);
      expect(validatePhone('081234567890')).toBe(true);
      expect(validatePhone('+6281234567890')).toBe(true);
      expect(validatePhone('6281234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      // Empty string is accepted as phone is optional
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abcdefghij')).toBe(false);
      expect(validatePhone('99999999999')).toBe(false); // Not starting with 08/628
    });

    it('should accept empty phone as optional', () => {
      // Phone is optional, empty should not throw
      expect(validatePhone(null)).toBe(true);
      expect(validatePhone(undefined)).toBe(true);
    });
  });

  describe('validateName', () => {
    it('should accept valid names', () => {
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('Ahmad')).toBe(true);
      expect(validateName('María García')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('  ')).toBe(false);
      expect(validateName('A')).toBe(false); // Too short
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove HTML tags', () => {
      // Script tags content remains after removing tags
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
      expect(sanitizeInput('<div><p>Test</p></div>')).toBe('Test');
    });

    it('should handle null/undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });
});

describe('Registration Validation', () => {
  it('should validate required fields', () => {
    const isValidRegistration = (data: {
      fullName: string;
      email: string;
    }) => {
      return validateName(data.fullName) && validateEmail(data.email);
    };

    expect(isValidRegistration({ fullName: 'John Doe', email: 'john@example.com' })).toBe(true);
    expect(isValidRegistration({ fullName: '', email: 'john@example.com' })).toBe(false);
    expect(isValidRegistration({ fullName: 'John Doe', email: '' })).toBe(false);
  });
});
