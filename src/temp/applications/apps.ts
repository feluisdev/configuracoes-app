import { Application } from '@/features/applications/types';

export const IGRP_MOCK_APPS_DATA: Application[] = [
  {
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
  }
];
