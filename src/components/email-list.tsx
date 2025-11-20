'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Star, Paperclip } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Email {
  _id: string;
  from: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  createdAt: string;
}

interface EmailListProps {
  folder: string;
  onEmailSelect: (emailId: string) => void;
  searchQuery?: string;
}

export default function EmailList({ folder, onEmailSelect, searchQuery = '' }: EmailListProps) {
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

  const toggleStar = async (e: React.MouseEvent, emailId: string, isStarred: boolean) => {
    e.stopPropagation();
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

  // Filter emails based on search query
  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.from.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredEmails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <Mail className="w-16 h-16 text-gray-300" />
        <div className="text-center">
          <p className="text-lg font-medium">
            {searchQuery ? 'No emails found' : `No emails in ${folder}`}
          </p>
          <p className="text-sm">
            {searchQuery ? `No results for "${searchQuery}"` : `Your ${folder} is empty`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredEmails.map((email) => (
          <div
            key={email._id}
            onClick={() => onEmailSelect(email._id)}
            className={cn(
              'flex items-start gap-4 p-4 cursor-pointer transition-all hover:shadow-sm',
              !email.isRead 
                ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            {/* Star Icon */}
            <button
              onClick={(e) => toggleStar(e, email._id, email.isStarred)}
              className="mt-1 shrink-0"
            >
              <Star
                className={cn(
                  'w-5 h-5 transition-colors',
                  email.isStarred 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-400 hover:text-gray-600'
                )}
              />
            </button>

            {/* Email Content */}
            <div className="flex-1 min-w-0">
              {/* From */}
              <div className="flex items-center gap-2 mb-1">
                <p className={cn(
                  'text-sm truncate',
                  !email.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'
                )}>
                  {email.from.split('<')[0].trim() || email.from}
                </p>
                {email.hasAttachments && (
                  <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </div>

              {/* Subject */}
              <p className={cn(
                'text-sm mb-1 truncate',
                !email.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'
              )}>
                {email.subject || '(No Subject)'}
              </p>

              {/* Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {email.body.substring(0, 120)}...
              </p>
            </div>

            {/* Time */}
            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0 mt-1">
              {formatDistanceToNow(new Date(email.createdAt), { addSuffix: false })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
