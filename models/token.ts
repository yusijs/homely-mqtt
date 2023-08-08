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
  exp: number;
};
