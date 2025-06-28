import {Settings2 } from 'lucide-react'
import { IGRPMenuProps } from '@/features/menus/types'

export const DEFAULT_IGRP_FOOTER_MENU = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2
  },
]

export const IGRPFooterMenu = typeof DEFAULT_IGRP_FOOTER_MENU

export const IGRP_DEFAULT_MENU: IGRPMenuProps[] = [
  {
    id: 1,
    name: "Home",
    type: "FOLDER",
    position: 1,
    icon: "AppWindow",
    status: "ACTIVE",
    target: "INTERNAL",
    url: null,
    parentId: null,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 2,
    name: "Settings",
    type: "MENU_PAGE",
    position: 1,
    icon: "Settings2",
    status: "ACTIVE",
    target: "INTERNAL",
    url: "/settings",
    parentId: 1,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 3,
    name: "Users",
    type: "MENU_PAGE",
    position: 2,
    icon: "UserCog",
    status: "ACTIVE",
    target: "INTERNAL",
    url: "/users",
    parentId: 1,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 4,
    name: "Roles",
    type: "EXTERNAL_PAGE",
    position: 2,
    icon: "Users",
    status: "ACTIVE",
    target: "INTERNAL",
    url: "/roles",
    parentId: null,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 9,
    name: "Roles",
    type: "EXTERNAL_PAGE",
    position: 4,
    icon: "Users",
    status: "ACTIVE",
    target: "INTERNAL",
    url: "/roles",
    parentId: null,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 5,
    name: "Home",
    type: "FOLDER",
    position: 3,
    icon: "AppWindow",
    status: "ACTIVE",
    target: "INTERNAL",
    url: null,
    parentId: null,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
  {
    id: 6,
    name: "Settings",
    type: "MENU_PAGE",
    position: 1,
    icon: "Settings2",
    status: "ACTIVE",
    target: "INTERNAL",
    url: "/settings",
    parentId: 5,
    applicationId: 1,
    resourceId: null,
    createdBy: "admin",
    createdDate: "2022-01-01T12:00:00.000Z",
    lastModifiedBy: "admin",
    lastModifiedDate: "2022-01-01T12:00:00.000Z"
  },
];