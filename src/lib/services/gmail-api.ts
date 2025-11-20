import { google } from 'googleapis';
import { simpleParser } from 'mailparser';

const gmail = google.gmail('v1');

interface EmailMessage {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  date: Date;
  hasAttachments: boolean;
}

export class GmailService {
  private oauth2Client;

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2();
    this.oauth2Client.setCredentials({ access_token: accessToken });
  }

  async listMessages(maxResults: number = 50): Promise<string[]> {
    try {
      const response = await gmail.users.messages.list({
        auth: this.oauth2Client,
        userId: 'me',
        maxResults,
        labelIds: ['INBOX'],
      });

      return response.data.messages?.map((msg) => msg.id!) || [];
    } catch (error) {
      console.error('Error listing messages:', error);
      throw error;
    }
  }

  async getMessage(messageId: string): Promise<EmailMessage> {
    try {
      const response = await gmail.users.messages.get({
        auth: this.oauth2Client,
        userId: 'me',
        id: messageId,
        format: 'raw',
      });

      const raw = response.data.raw;
      if (!raw) {
        throw new Error('No raw message data');
      }

      // Decode base64url
      const buffer = Buffer.from(raw, 'base64url');
      const parsed = await simpleParser(buffer);

      // Helper to extract email address
      const getEmailAddress = (addr: any): string => {
        if (!addr) return 'Unknown';
        if (Array.isArray(addr)) {
          return addr[0]?.text || addr[0]?.address || 'Unknown';
        }
        return addr.text || addr.address || 'Unknown';
      };

      return {
        messageId: response.data.id || messageId,
        from: getEmailAddress(parsed.from),
        to: getEmailAddress(parsed.to),
        subject: parsed.subject || 'No Subject',
        body: parsed.text || '',
        htmlBody: parsed.html ? String(parsed.html) : undefined,
        date: parsed.date || new Date(),
        hasAttachments: (parsed.attachments?.length || 0) > 0,
      };
    } catch (error) {
      console.error('Error getting message:', error);
      throw error;
    }
  }

  async sendMessage(to: string, subject: string, text: string, html?: string): Promise<string> {
    try {
      const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        html || text,
      ].join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await gmail.users.messages.send({
        auth: this.oauth2Client,
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return response.data.id || '';
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async modifyMessage(messageId: string, addLabels?: string[], removeLabels?: string[]): Promise<void> {
    try {
      await gmail.users.messages.modify({
        auth: this.oauth2Client,
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: addLabels,
          removeLabelIds: removeLabels,
        },
      });
    } catch (error) {
      console.error('Error modifying message:', error);
      throw error;
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.modifyMessage(messageId, undefined, ['UNREAD']);
  }

  async markAsUnread(messageId: string): Promise<void> {
    await this.modifyMessage(messageId, ['UNREAD']);
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await gmail.users.messages.trash({
        auth: this.oauth2Client,
        userId: 'me',
        id: messageId,
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}
