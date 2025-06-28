export interface Application {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  type: 'INTERNAL' | 'EXTERNAL';
  owner: string;
  picture?: string;
  url?: string | null;
  slug?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}
