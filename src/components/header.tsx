'use client';

import { useState } from 'react';
import { RefreshCw, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSync: () => void;
  syncing: boolean;
}

export default function Header({ onSync, syncing }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Email Client</h1>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSync}
            disabled={syncing}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', syncing && 'animate-spin')} />
            Sync
          </Button>
        </div>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
