// Email helper - transactional emails
// Can be extended to use Resend, SendGrid, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  storeName: string;
  storeUrl: string;
  amount: number;
}

interface DeploymentNotificationData {
  storeName: string;
  storeUrl: string;
  customerEmail: string;
}

class EmailService {
  private defaultFrom = process.env.EMAIL_FROM || 'KEDAI <noreply@kedai.my>';

  async send(options: EmailOptions): Promise<boolean> {
    const { to, subject, html, from = this.defaultFrom } = options;

    // TODO: Implement actual email sending with Resend/SendGrid
    // For now, just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', { to, subject, from });
      console.log('Content:', html);
      return true;
    }

    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ from, to, subject, html });

    return true;
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { color: #8b5cf6; font-size: 24px; font-weight: bold; }
          h1 { color: #f8fafc; font-size: 20px; }
          .details { background: #334155; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KEDAI</div>
          </div>
          <h1>Terima kasih, ${data.customerName}! 🎉</h1>
          <p>Pembayaran anda telah berjaya. Kedai online anda sedang disediakan.</p>
          <div class="details">
            <p><strong>No. Pesanan:</strong> ${data.orderNumber}</p>
            <p><strong>Nama Kedai:</strong> ${data.storeName}</p>
            <p><strong>Jumlah:</strong> RM ${data.amount.toFixed(2)}</p>
          </div>
          <p>Kedai anda akan siap dalam beberapa minit. Kami akan hantar email lagi apabila kedai anda sudah live!</p>
          <p style="text-align: center; margin-top: 24px;">
            <a href="${data.storeUrl}" class="btn">Lihat Kedai Anda</a>
          </p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} KEDAI. Hak cipta terpelihara.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to: data.customerEmail || '',
      subject: `✅ Pesanan #${data.orderNumber} Berjaya - KEDAI`,
      html,
    });
  }

  async sendDeploymentComplete(data: DeploymentNotificationData): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { color: #8b5cf6; font-size: 24px; font-weight: bold; }
          h1 { color: #f8fafc; font-size: 20px; }
          .highlight { background: linear-gradient(to right, #8b5cf6, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KEDAI</div>
          </div>
          <h1>Kedai Anda Sudah Live! 🚀</h1>
          <p>Tahniah! Kedai <strong class="highlight">${data.storeName}</strong> anda kini sudah boleh diakses oleh pelanggan.</p>
          <p style="text-align: center; margin: 24px 0;">
            <a href="${data.storeUrl}" class="btn">Buka Kedai Sekarang</a>
          </p>
          <p>Kongsi link kedai anda di WhatsApp, Instagram, atau media sosial lain untuk mula menerima pesanan!</p>
          <p><strong>Link kedai anda:</strong><br/>
          <a href="${data.storeUrl}" style="color: #8b5cf6;">${data.storeUrl}</a></p>
          <div class="footer">
            <p>Ada soalan? Balas email ini atau hubungi kami di WhatsApp.</p>
            <p>© ${new Date().getFullYear()} KEDAI. Hak cipta terpelihara.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.send({
      to: data.customerEmail,
      subject: `🚀 Kedai ${data.storeName} Sudah Live! - KEDAI`,
      html,
    });
  }
}

export const emailService = new EmailService();
