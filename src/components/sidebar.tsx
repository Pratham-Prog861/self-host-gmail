'use client';

import { useState, useEffect } from 'react';
import { Inbox, Send, Star, Edit, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Folder {
  name: string;
  label: string;
  count: number;
}

interface SidebarProps {
  currentFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
}

export default function Sidebar({ currentFolder, onFolderChange, onCompose }: SidebarProps) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      const data = await response.json();
      if (data.success) {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const getFolderIcon = (folderName: string) => {
    switch (folderName) {
      case 'inbox':
        return <Inbox className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'drafts':
        return <Edit className="w-4 h-4" />;
      case 'starred':
        return <Star className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="p-4">
        <Button onClick={onCompose} className="w-full">
          <Edit className="w-4 h-4 mr-2" />
          Compose
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => onFolderChange(folder.name)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                currentFolder === folder.name
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              )}
            >
              <div className="flex items-center gap-3">
                {getFolderIcon(folder.name)}
                <span>{folder.label}</span>
              </div>
              {folder.count > 0 && (
                <span className="text-xs text-muted-foreground">{folder.count}</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
