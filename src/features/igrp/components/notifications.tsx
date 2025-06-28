'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/features/igrp/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/igrp/components/ui/dropdown-menu';
import { Badge } from '@/features/igrp/components/ui/badge';

export function Notifications() {
  const [notificationCount, setNotificationCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'New user registered',
      description: 'A new user has registered to the platform.',
      time: '2 minutes ago',
    },
    {
      id: 2,
      title: 'System update completed',
      description: 'The system update has been successfully completed.',
      time: '1 hour ago',
    },
    {
      id: 3,
      title: 'Maintenance scheduled',
      description: 'System maintenance scheduled for tomorrow at 2 AM.',
      time: '3 hours ago',
    },
  ];

  const markAsRead = () => {
    setNotificationCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7 relative">
          <Bell strokeWidth={2} />
          {notificationCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notificationCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAsRead} className="h-auto text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-4 cursor-pointer"
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.description}</div>
                <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-4 px-2 text-center text-muted-foreground">No new notifications</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
