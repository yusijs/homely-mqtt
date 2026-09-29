import fetch from 'node-fetch';
import { Token, TokenResponse } from '../models/token';
import { logger } from '../utils/logger';
import config from 'config';

const host = config.get<string>('homely.host');
const uri = `https://${host}/homely`;

/**
 * Renew tokens a little before Homely expires them. Capped at a tenth of the
 * lifetime, since Homely's access tokens can be short-lived.
 */
const expiresAt = (now: number, seconds: number) =>
  now + seconds * 1000 - Math.min(60_000, seconds * 100);

class Authentication {
  private token?: Token;
  /** A login or refresh in flight, shared so parallel callers (poll + websocket) don't each hit the endpoint */
  private pending?: Promise<Token>;

  private toToken(response: TokenResponse): Token {
    const now = Date.now();
    return {
      ...response,
      exp: expiresAt(now, response.expires_in),
      refreshExp: response.refresh_expires_in
        ? expiresAt(now, response.refresh_expires_in)
        : undefined,
    };
  }

  private static isComplete(response: Partial<TokenResponse>) {
    return Boolean(
      response.expires_in && response.access_token && response.refresh_token
    );
  }

  /**
   * Authenticate with homely and store the token
   * @private
   * @returns {Promise<Token>}
   */
  private async auth() {
    const res = await fetch(`${uri}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.HOMELY_USER,
        password: process.env.HOMELY_PASSWORD,
      }),
    });
    if (res.status >= 400) {
      let result;
      if (res.headers.get('Content-Type')?.includes('json')) {
        result = await res.json();
      } else {
        result = await res.text();
      }
      logger.fatal({
        message: `Error: Homely replied with error code ${res.status}: ${res.statusText}`,
        result,
      });
      process.exit();
    }
    const response: TokenResponse = await res.json();
    if (!Authentication.isComplete(response)) {
      const { access_token, refresh_token, ...rest } = response;
      logger.fatal({
        message: `Error: Token payload from Homely is missing required fields (access_token, expires_in, refresh_token)`,
        object: rest, // Don't log token out in cleartext
      });
      process.exit();
    }
    this.token = this.toToken(response);
    logger.info(
      `Authenticated. Token expires at ${new Date(
        this.token.exp
      ).toISOString()}`
    );
    return this.token;
  }

  /**
   * Use the refresh token to get a new access token. If Homely refuses the
   * refresh (e.g. the session has ended), log in again with the credentials
   * instead of storing the error response as the token.
   * @private
   * @returns {Promise<Token>}
   */
  private async refreshToken(refreshToken: string) {
    try {
      const res = await fetch(`${uri}/oauth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });
      if (res.ok) {
        const response: TokenResponse = await res.json();
        if (Authentication.isComplete(response)) {
          this.token = this.toToken(response);
          logger.debug('Refreshed token');
          return this.token;
        }
        logger.warn('Token refresh response was incomplete, logging in again');
      } else {
        logger.warn(
          `Token refresh failed with ${res.status} ${res.statusText}, logging in again`
        );
      }
    } catch (err) {
      logger.warn(`Token refresh failed (${err}), logging in again`);
    }
    return await this.auth();
  }

  /**
   * Get the token, either from cache, by refresh-token or by authenticating
   * @returns {Promise<Token>}
   */
  public async getToken(): Promise<Token> {
    const current = this.token;
    if (current && current.exp > Date.now()) {
      logger.debug('Using cached token');
      return current;
    }
    if (!this.pending) {
      const canRefresh =
        current?.refresh_token &&
        (!current.refreshExp || current.refreshExp > Date.now());
      logger.debug(canRefresh ? 'Refreshing token' : 'Authenticating');
      this.pending = (
        canRefresh ? this.refreshToken(current.refresh_token) : this.auth()
      ).finally(() => {
        this.pending = undefined;
      });
    }
    return await this.pending;
  }

  /**
   * Forget the cached token, e.g. after Homely rejected it. The next
   * getToken() logs in again.
   */
  public invalidate() {
    this.token = undefined;
  }
}

export const authenticator = new Authentication();
