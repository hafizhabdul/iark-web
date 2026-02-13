import { NextRequest, NextResponse } from 'next/server';
import { sendRegistrationConfirmation, sendAdminRegistrationNotification } from '@/lib/email/send';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, eventName, eventDate, eventLocation } = body;

    if (!email || !eventName || !eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send confirmation to user + notify admin (parallel, fire-and-forget)
    const [emailSent, adminNotified] = await Promise.all([
      sendRegistrationConfirmation(email, eventName, eventDate, eventLocation || 'TBD'),
      sendAdminRegistrationNotification(email, eventName, eventDate, eventLocation || 'TBD'),
    ]);

    return NextResponse.json({ 
      success: true, 
      emailSent,
      adminNotified,
    });
  } catch (error) {
    console.error('Email API error:', error);
    // Graceful failure - return success even if email fails
    return NextResponse.json({ 
      success: true, 
      emailSent: false,
      error: 'Email sending failed but registration is complete'
    });
  }
}
