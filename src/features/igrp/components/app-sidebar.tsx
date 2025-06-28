'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from '@/features/igrp/components/ui/sidebar';
import { NavUser } from './nav-user';
import { AppSwitcher } from './app-switcher';
import { IGRPMenus } from './app-menus';
import { useApplicationByCode, useApplications } from '@/features/applications/hooks/use-applications';

// TDOD: messages

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const appCode = process.env.NEXT_PUBLIC_IGRP_APP_CODE || '';

  // if (!appCode) throw new Error('Missing IGRP_APP_CODE'); 

  const { data: application, isLoading, error } = useApplicationByCode(appCode);
  const { data: apps, isLoading: appsLoading, error: fetchError } = useApplications();

  if (appsLoading && !fetchError) return <></>;
  if (isLoading && !error) return <></>;

  if (error) throw error;
  if (fetchError) throw fetchError;

  const app = application?.[0];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher apps={apps} currentApp={app} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <IGRPMenus appId={app?.id} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
