'use client';

import { useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import EmailList from '@/components/email-list';
import EmailDetail from '@/components/email-detail';
import ComposeEmail from '@/components/compose-email';

export default function Home() {
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/emails/sync', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        alert(`Synced ${data.count} new emails`);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error syncing emails:', error);
      alert('Failed to sync emails');
    } finally {
      setSyncing(false);
    }
  };

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

  const handleEmailDelete = () => {
    setSelectedEmailId(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder);
    setSelectedEmailId(null);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onSync={handleSync} syncing={syncing} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 shrink-0">
          <Sidebar
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            onCompose={() => setShowCompose(true)}
          />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-96 border-r">
            <EmailList
              key={`${currentFolder}-${refreshKey}`}
              folder={currentFolder}
              onEmailSelect={handleEmailSelect}
              selectedEmailId={selectedEmailId || undefined}
            />
          </div>
          <div className="flex-1">
            {selectedEmailId ? (
              <EmailDetail
                emailId={selectedEmailId}
                onBack={() => setSelectedEmailId(null)}
                onDelete={handleEmailDelete}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select an email to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCompose && (
        <ComposeEmail
          onClose={() => setShowCompose(false)}
          onSent={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
