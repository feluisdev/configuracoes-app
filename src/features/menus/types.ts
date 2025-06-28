export type IGRPMenuProps = {
  id: number;
  name: string;
  type: 'FOLDER' | 'MENU_PAGE' | 'EXTERNAL_PAGE';
  position: number;
  icon: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  target: 'INTERNAL' | 'EXTERNAL';
  url: string | null;
  parentId: number | null;
  applicationId: number;
  resourceId: number | null;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
};
