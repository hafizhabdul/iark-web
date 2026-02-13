import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('SMTP not configured, skipping email');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ia-rk.com',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Registration confirmation email
export async function sendRegistrationConfirmation(
  email: string,
  eventName: string,
  eventDate: string,
  eventLocation: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `✅ Pendaftaran Berhasil - ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #E21C24 0%, #1E40AF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .event-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pendaftaran Berhasil!</h1>
          </div>
          <div class="content">
            <p>Terima kasih telah mendaftar untuk:</p>
            <div class="event-details">
              <h2 style="margin: 0 0 10px 0; color: #E21C24;">${eventName}</h2>
              <p style="margin: 5px 0;"><strong>📅 Tanggal:</strong> ${eventDate}</p>
              <p style="margin: 5px 0;"><strong>📍 Lokasi:</strong> ${eventLocation}</p>
            </div>
            <p>Kami akan mengirimkan reminder sebelum acara berlangsung.</p>
            <p>Sampai jumpa!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} IARK - Ikatan Alumni Rumah Kepemimpinan</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Admin notification for new registration
export async function sendAdminRegistrationNotification(
  registrantEmail: string,
  eventName: string,
  eventDate: string,
  eventLocation: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return false;
  }

  return sendEmail({
    to: adminEmail,
    subject: `📋 Pendaftaran Baru - ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1E40AF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
          .detail { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">Pendaftaran Baru</h2>
          </div>
          <div class="content">
            <p>Ada pendaftar baru untuk event:</p>
            <div class="detail">
              <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
              <p style="margin: 5px 0;"><strong>📅 Tanggal:</strong> ${eventDate}</p>
              <p style="margin: 5px 0;"><strong>📍 Lokasi:</strong> ${eventLocation}</p>
              <p style="margin: 5px 0;"><strong>📧 Email Pendaftar:</strong> ${registrantEmail}</p>
            </div>
            <p style="font-size: 13px; color: #666;">Cek dashboard admin untuk detail lengkap.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} IARK Admin</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Event reminder email
export async function sendEventReminder(
  email: string,
  eventName: string,
  eventDate: string,
  daysLeft: number
): Promise<boolean> {
  const urgency = daysLeft === 1 ? '⏰ Besok!' : `📅 ${daysLeft} Hari Lagi`;
  
  return sendEmail({
    to: email,
    subject: `${urgency} - ${eventName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #E21C24 0%, #1E40AF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .countdown { font-size: 48px; text-align: center; color: #E21C24; font-weight: bold; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${urgency}</h1>
          </div>
          <div class="content">
            <div class="countdown">${daysLeft}</div>
            <p style="text-align: center; font-size: 18px;">hari lagi menuju</p>
            <h2 style="text-align: center; color: #1E40AF;">${eventName}</h2>
            <p style="text-align: center;"><strong>📅 ${eventDate}</strong></p>
            <p style="text-align: center; margin-top: 20px;">Jangan lupa untuk mempersiapkan diri!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} IARK - Ikatan Alumni Rumah Kepemimpinan</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Donation thank you email
export async function sendDonationThankYou(
  email: string,
  donorName: string,
  amount: number
): Promise<boolean> {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  return sendEmail({
    to: email,
    subject: `🙏 Terima Kasih atas Donasi Anda`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #E21C24 0%, #1E40AF 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .amount { font-size: 36px; text-align: center; color: #16a34a; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Terima Kasih, ${donorName}!</h1>
          </div>
          <div class="content">
            <p style="text-align: center;">Donasi Anda telah kami terima:</p>
            <div class="amount">${formattedAmount}</div>
            <p>Kontribusi Anda sangat berarti bagi kami dalam membangun komunitas alumni yang lebih baik dan berdampak positif untuk Indonesia.</p>
            <p>Semoga Allah SWT membalas kebaikan Anda dengan berlipat ganda.</p>
            <p style="margin-top: 20px;"><em>— Tim IARK</em></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} IARK - Ikatan Alumni Rumah Kepemimpinan</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
