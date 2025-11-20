'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Star, Trash2, Archive, Reply, Forward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function EmailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailId, setEmailId] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setEmailId(p.id);
      fetchEmail(p.id);
    });
  }, [params]);

  const fetchEmail = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/emails/${id}`);
      const data = await response.json();
      if (data.success) {
        setEmail(data.email);
        // Mark as read
        if (!data.email.isRead) {
          await fetch(`/api/emails/${id}`, {
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
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="p-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-500">Email not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Inbox
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Actions */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inbox
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleStar}>
              <Star
                className={cn(
                  'w-5 h-5',
                  email.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                )}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="w-5 h-5 text-red-600" />
            </Button>
          </div>
        </div>

        {/* Subject */}
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
          {email.subject || '(No Subject)'}
        </h1>

        {/* From/To Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {email.from.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {email.from.split('<')[0].trim() || email.from}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  to {email.to.split('<')[0].trim() || email.to}
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Email Body */}
      <ScrollArea className="flex-1 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-8">
          {email.htmlBody ? (
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          ) : (
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
              {email.body}
            </p>
          )}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <Button className="gap-2">
            <Reply className="w-4 h-4" />
            Reply
          </Button>
          <Button variant="outline" className="gap-2">
            <Forward className="w-4 h-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}
