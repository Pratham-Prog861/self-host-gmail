'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star, Trash2, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Email {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  htmlBody?: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
}

interface EmailDetailProps {
  emailId: string;
  onBack: () => void;
  onDelete: () => void;
}

export default function EmailDetail({ emailId, onBack, onDelete }: EmailDetailProps) {
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmail();
  }, [emailId]);

  const fetchEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails/${emailId}`);
      const data = await response.json();
      if (data.success) {
        setEmail(data.email);
        // Mark as read
        if (!data.email.isRead) {
          await fetch(`/api/emails/${emailId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching email:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async () => {
    if (!email) return;
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: !email.isStarred }),
      });
      setEmail({ ...email, isStarred: !email.isStarred });
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading email...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Email not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleStar}>
              <Star
                className={cn(
                  'w-4 h-4',
                  email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
                )}
              />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <p>From: {email.from}</p>
            <p>To: {email.to}</p>
          </div>
          <p>{formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {email.htmlBody ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          ) : (
            <p className="whitespace-pre-wrap">{email.body}</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
