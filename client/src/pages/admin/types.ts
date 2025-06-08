export type AdminSection = 
  | "dashboard"
  | "site-config"
  | "content-manager"
  | "design-editor"
  | "media-library"
  | "backup-manager"
  | "user-manager";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}