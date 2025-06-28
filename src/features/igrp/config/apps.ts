import { Application } from '@/features/applications/types';
import { GalleryVerticalEnd } from 'lucide-react';

export const DEFAULT_IGRP_APPS = [
  {
    name: 'IGRP',
    logo: {
      src: '/igrp/logo-no-text.png',
      srcDark: '/igrp/logo-negative.png',
    },
    icon: GalleryVerticalEnd,
    description: 'App Center',
  },
];

export type IGRPAppsProps = typeof DEFAULT_IGRP_APPS;

export const DEFAULT_IGRP_APPS_DATA: Application = {
  id: 1,
  code: 'APP001',
  name: 'IGRP Demo',
  description: 'This is an app test for the IGRP',
  status: 'ACTIVE',
  type: 'INTERNAL',
  owner: 'igrp@nosi.cv',
  picture: '/igrp/logo-no-text.png',
  url: 'https://igrp.cv',
  slug: 'user-management',
  createdBy: 'system',
  createdDate: '2024-01-15T10:30:00Z',
  lastModifiedBy: 'admin',
  lastModifiedDate: '2024-03-01T14:20:00Z',
};
