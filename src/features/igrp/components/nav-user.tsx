'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronsUpDown, LogOut, User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from './ui/sidebar';
import { UserAvatar } from './user-avatar';
import { useCurrentUser } from '@/features/users/hooks/use-users';
import { UserProps } from '@/features/users/types';
import { getInitials } from '@/lib/utils';
import { useMockUser } from "@/temp/users/useMockUser";


export function NavUser() {
  const { mockUser } = useMockUser();
  const [currentUser, setCurrentUser] = useState<UserProps>(mockUser);
  const { data: user, isLoading, error } = useCurrentUser();

  const { isMobile } = useSidebar()

  if (isLoading && !error) return <></>;
  if (error) throw error;
  if (user) setCurrentUser(user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer group-data-[collapsible=icon]:pl-0! py-2!"
              tooltip={currentUser.username}
              size="lg"
            >
              <UserAvatar
                image={currentUser.image}
                alt={currentUser.username}
                fallbackContent={getInitials(currentUser.username)}
                fallbackClass="text-xs"
                className="shadow-md"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser.username || "N/A"}</span>
                <span className="truncate text-xs">{currentUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-3.5" strokeWidth={2} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.fullname}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-primary! hover:text-primary-foreground!"
            >
              <Link href="/users/profile">
                <User className="mr-1 size-3.5 hover:text-primary-foreground!" strokeWidth={2} />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            {/* <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-primary! hover:text-primary-foreground!"
            >
              <Link href="/users/notifications">
                <Bell className="mr-1 size-3.5 hover:text-primary-foreground!" strokeWidth={2} />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}

            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-primary! hover:text-primary-foreground!"
            >
              <Link href="/logout">
                <LogOut className="mr-1 size-3.5 hover:text-primary-foreground!" strokeWidth={2} />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
