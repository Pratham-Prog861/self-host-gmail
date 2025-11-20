'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
}

interface EmailListProps {
  folder: string;
  onEmailSelect: (emailId: string) => void;
  selectedEmailId?: string;
}

export default function EmailList({ folder, onEmailSelect, selectedEmailId }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, [folder]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails?folder=${folder}`);
      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async (emailId: string, isStarred: boolean) => {
    try {
      await fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: !isStarred }),
      });
      fetchEmails();
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading emails...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Mail className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">No emails in {folder}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {emails.map((email) => (
          <div
            key={email._id}
            onClick={() => onEmailSelect(email._id)}
            className={cn(
              'p-4 cursor-pointer hover:bg-accent transition-colors',
              selectedEmailId === email._id && 'bg-accent',
              !email.isRead && 'font-semibold'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm truncate">{email.from}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-sm truncate mb-1">{email.subject}</p>
                <p className="text-xs text-muted-foreground truncate">{email.body}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(email._id, email.isStarred);
                }}
                className="shrink-0"
              >
                <Star
                  className={cn(
                    'w-4 h-4',
                    email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
