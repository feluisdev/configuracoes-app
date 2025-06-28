import { ThemeSelector } from '@/features/igrp/components/theme-selector';

export default function SettingsPage() {
  return (
    <section className="space-y-6 animate-fade-in">
      <div>System Settings</div>
      <ThemeSelector />
    </section>
  );
}
