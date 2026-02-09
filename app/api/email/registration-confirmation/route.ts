import { NextRequest, NextResponse } from 'next/server';
import { sendRegistrationConfirmation } from '@/lib/email/send';

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

    // Send email (graceful failure - don't fail the request if email fails)
    const emailSent = await sendRegistrationConfirmation(
      email,
      eventName,
      eventDate,
      eventLocation || 'TBD'
    );

    return NextResponse.json({ 
      success: true, 
      emailSent 
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
