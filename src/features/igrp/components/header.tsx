import { Breadcrumbs } from './breadcrumbs';
import { CommandSearch } from './command-search';
import { LanguageSelector } from './language-selector';
import { ModeSwitcher } from './mode-switcher';
// import { Notifications } from './notifications';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

interface HeaderProps {
  showBreadcrumbs?: boolean;
}
export function Header({ showBreadcrumbs }: HeaderProps) {
  return (
    <header className='bg-background sticky top-0 inset-x-0 isolate z-10 border-b flex items-center justify-between gap-2 px-4'>
      <div className='flex items-center gap-2 h-12'>
        <SidebarTrigger />
        {showBreadcrumbs && (
          <>
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumbs />
          </>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <CommandSearch />
        {/* <span className='hidden md:block'>
          <Notifications />
        </span> */}
        <ModeSwitcher />
        <LanguageSelector />
      </div>
    </header>
  );
}
