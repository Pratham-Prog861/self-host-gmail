import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

interface EmailMessage {
  messageId?: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  date: Date;
  hasAttachments: boolean;
}

class ImapService {
  private client: ImapFlow | null = null;

  private async connect(): Promise<ImapFlow> {
    if (this.client) {
      return this.client;
    }

    const client = new ImapFlow({
      host: process.env.IMAP_HOST || 'imap.gmail.com',
      port: Number(process.env.IMAP_PORT) || 993,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_APP_PASSWORD || '',
      },
      logger: false,
    });

    await client.connect();
    this.client = client;
    return client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.logout();
      this.client = null;
    }
  }

  async fetchEmails(folder: string = 'INBOX', limit: number = 50): Promise<EmailMessage[]> {
    const client = await this.connect();
    const emails: EmailMessage[] = [];

    try {
      // Select the mailbox
      const lock = await client.getMailboxLock(folder);

      try {
        // Fetch the latest emails
        const messages = client.fetch(`1:${limit}`, {
          envelope: true,
          source: true,
          flags: true,
        });

        for await (const message of messages) {
          try {
            // Parse the email
            if (!message.source) continue;
            const parsed = await simpleParser(message.source);

            const email: EmailMessage = {
              messageId: parsed.messageId || undefined,
              from: parsed.from?.text || 'Unknown',
              to: parsed.to?.text || 'Unknown',
              subject: parsed.subject || 'No Subject',
              body: parsed.text || '',
              htmlBody: parsed.html ? String(parsed.html) : undefined,
              date: parsed.date || new Date(),
              hasAttachments: (parsed.attachments?.length || 0) > 0,
            };

            emails.push(email);
          } catch (parseError) {
            console.error('Error parsing email:', parseError);
          }
        }
      } finally {
        lock.release();
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }

    return emails;
  }

  async markAsRead(messageId: string): Promise<void> {
    const client = await this.connect();

    try {
      const lock = await client.getMailboxLock('INBOX');

      try {
        // Search for the message by Message-ID
        const messages = await client.search({ header: ['message-id', messageId] });

        if (Array.isArray(messages) && messages.length > 0) {
          await client.messageFlagsAdd(messages as any, ['\\Seen']);
        }
      } finally {
        lock.release();
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw error;
    }
  }

  async deleteEmail(messageId: string): Promise<void> {
    const client = await this.connect();

    try {
      const lock = await client.getMailboxLock('INBOX');

      try {
        // Search for the message by Message-ID
        const messages = await client.search({ header: ['message-id', messageId] });

        if (Array.isArray(messages) && messages.length > 0) {
          await client.messageFlagsAdd(messages as any, ['\\Deleted']);
        }
      } finally {
        lock.release();
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      throw error;
    }
  }
}

export default new ImapService();
