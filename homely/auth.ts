import fetch from 'node-fetch';
import { Token } from '../models/token';
import { logger } from '../utils/logger';
import config from 'config';

const host = config.get<string>('homely.host');
const uri = `https://${host}/homely`;

class Authentication {
  private token!: Token;

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
    this.token = await res.json();
    if (
      !this.token.expires_in ||
      !this.token.access_token ||
      !this.token.refresh_token
    ) {
      const { access_token, refresh_token, ...rest } = this.token;
      logger.fatal({
        message: `Error: Token payload from Homely is missing required fields (access_token, expires_in, refresh_token)`,
        object: rest, // Don't log token out in cleartext
      });
      process.exit();
    }
    this.token.exp = Date.now() + this.token.expires_in * 1000;
    logger.info(
      `Authenticated. Token expires at ${new Date(
        this.token.exp
      ).toISOString()}`
    );
    return this.token;
  }

  /**
   * Use the refresh token to get a new access token
   * @private
   * @returns {Promise<Token>}
   */
  private async refreshToken() {
    const res = await fetch(`${uri}/oauth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.token.refresh_token,
      }),
    });
    this.token = await res.json();
    this.token.exp = Date.now() + (this.token.expires_in - 50) * 1000;
    return this.token;
  }

  /**
   * Get the token, either from cache, by refresh-token or by authenticating
   * @returns {Promise<Token>}
   */
  public async getToken() {
    if (this.token && this.token.exp > Date.now()) {
      logger.debug('Using cached token');
      return this.token;
    } else if (this.token && this.token.exp < Date.now()) {
      logger.debug('Refreshing token');
      return await this.refreshToken();
    } else {
      logger.debug('Authenticating');
      return await this.auth();
    }
  }
}

export const authenticator = new Authentication();
