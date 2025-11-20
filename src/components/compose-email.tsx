'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface ComposeEmailProps {
  onClose: () => void;
  onSent: () => void;
}

export default function ComposeEmail({ onClose, onSent }: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject) {
      alert('Please fill in recipient and subject');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          text: body,
          html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Email sent successfully!');
        onSent();
        onClose();
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-[600px] max-w-[90vw] shadow-2xl z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">New Message</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-4 space-y-4">
        <Input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Message"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="resize-none"
        />
      </div>
      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </Card>
  );
}
