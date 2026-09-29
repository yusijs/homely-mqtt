/**
 * Token response from homely's oauth endpoint
 */
export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
};

export type Token = TokenResponse & {
  /** When the access token should be renewed (epoch ms) */
  exp: number;
  /** When the refresh token stops working (epoch ms); after that a new login is needed */
  refreshExp?: number;
};
