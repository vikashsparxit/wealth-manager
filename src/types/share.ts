export interface SharedDashboard {
  id: string;
  user_id: string;
  share_token: string;
  password_hash: string;
  status: 'active' | 'revoked';
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface ShareAccess {
  id: string;
  shared_dashboard_id: string;
  access_time: string;
  success: boolean;
  ip_address: string | null;
}