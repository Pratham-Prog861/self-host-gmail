'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import EmailList from '@/components/email-list';
import ComposeEmail from '@/components/compose-email';

export default function Dashboard() {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

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
    router.push(`/dashboard/email/${emailId}`);
  };

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSync={handleSync} syncing={syncing} onSearch={handleSearch} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <Sidebar
            currentFolder={currentFolder}
            onFolderChange={handleFolderChange}
            onCompose={() => setShowCompose(true)}
          />
        </div>
        
        {/* Main Content - Full Width Email List */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          <EmailList
            key={`${currentFolder}-${refreshKey}-${searchQuery}`}
            folder={currentFolder}
            onEmailSelect={handleEmailSelect}
            searchQuery={searchQuery}
          />
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
