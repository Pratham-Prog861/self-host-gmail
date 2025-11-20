'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="fixed bottom-0 right-4 md:bottom-4 w-full md:w-[600px] md:max-w-[90vw] shadow-2xl z-50 animate-slide-up border-2">
        <div className="flex items-center justify-between p-4 border-b bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-lg font-semibold">New Message</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">To</label>
            <Input
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Subject</label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Message</label>
            <Textarea
              placeholder="Write your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="resize-none bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={sending}
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </Card>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
