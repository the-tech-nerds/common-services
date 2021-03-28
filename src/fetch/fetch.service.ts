import { HttpException, HttpStatus } from '@nestjs/common';
import * as queryString from 'query-string';
import * as fetch from 'isomorphic-fetch';
import * as debug from 'debug';

export interface Request {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: { [s: string]: string };
  qs?: { [s: string]: string | Array<string | number> };
  body?: any;
  userId?: number;
  domain?: string;
  hosts?: string;
  token?: string;
  contentType?: 'JSON' | 'FILE';
}

export class FetchService {
  async execute(path: string, request: Request) {
    const {
      method = 'GET',
      headers = {},
      qs = {},
      body = '',
      userId: reqUserId = 0,
      token: optionToken = '',
      domain = '',
      contentType = 'JSON',
    } = request || {};

    if (!path) {
      throw new HttpException(
        'Specific path is required to execute a fetch call',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const query =
      qs && Object.keys(qs).length > 0
        ? queryString.stringify({ ...qs }).replace(/%2C/g, ',')
        : '';

    const url = `${path}?${query}`;
    const requestHeaders = optionToken
      ? { ...headers, access_token: optionToken }
      : headers;

    let startTime: number;

    if (process.env.NODE_ENV === 'development') {
      startTime = Date.now();
    }
    const content_type =
      contentType == 'JSON'
        ? { 'Content-Type': 'application/json', userId: `${reqUserId}` }
        : { userId: `${reqUserId}` };
    const resp = await fetch(url, {
      method,
      headers: Object.assign(content_type, requestHeaders),
      body: body
        ? contentType == 'JSON'
          ? JSON.stringify(body)
          : body
        : undefined,
      cache: 'no-cache',
      redirect: 'follow',
      referrer: domain.length ? domain : 'no-referrer',
    });

    const responseTime = `${Date.now() - startTime || 0}ms`;
    const log = debug('fetch');

    if (process.env.NODE_ENV === 'development') {
      log(
        `[fetchService] ${method.toUpperCase()} ${url}\n  payload: ${
          body ? JSON.stringify(body, null, 2) : '{}'
        }\n  response: ${resp.status} ${
          resp.ok ? '' : resp.statusText
        }\n  took ${responseTime}`,
      );
    }

    if (!resp.ok) {
      throw new HttpException(
        `Failed making ${method} request to ${path}: ${JSON.stringify(
          await resp.json(),
        )}`,
        resp.status,
      );
    }

    return resp.json();
  }
}
