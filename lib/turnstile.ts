/**
 * Cloudflare Turnstile verification
 * Server-side validation of Turnstile tokens
 */

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify a Turnstile token server-side
 * @param token - The token from the client-side Turnstile widget
 * @returns true if valid, false otherwise
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured, skipping verification');
    // In development without key, allow through
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  if (!token) {
    console.error('Turnstile token is empty');
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
    }

    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Middleware helper to verify Turnstile in API routes
 */
export async function requireTurnstile(token: string | null | undefined): Promise<{
  valid: boolean;
  error?: string;
}> {
  if (!token) {
    return { valid: false, error: 'Turnstile token is required' };
  }

  const isValid = await verifyTurnstile(token);

  if (!isValid) {
    return { valid: false, error: 'Turnstile verification failed' };
  }

  return { valid: true };
}
