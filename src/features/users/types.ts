export interface UserProps {
  id: string;
  igrpUsername: string;
  username: string;
  fullname?: string | null;
  name: string;
  email: string;
  roles?: string[];
  departments?: string[];
  apps?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  signature?: string | null;
  image?: string | null;
  picture?: string | null;
}
