import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class SmtpService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || '',
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

export default new SmtpService();
