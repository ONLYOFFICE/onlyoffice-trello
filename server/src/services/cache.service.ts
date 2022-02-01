/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { Constants } from '@utils/const';

/**
 * A wrapper over cache-manager to handle Redis caching
 */
@Injectable()
export class CacheService {
  constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly constants: Constants,
  ) {}

  /**
   * A GET Wrapper over cache-manager
   *
   * @param key An entry's key to fetch
   * @returns The entry's value or undefined
   */
  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }

  /**
   * A SET Wrapper over cache-manager
   *
   * @param key An entry to assign value to
   * @param value
   * @param ttl Time to live in seconds
   */
  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.cache.set(key, value, {
        ttl,
      });
    } else {
      await this.cache.set(key, value);
    }
  }

  /**
   * A DEL Wrapper over cache-manager
   *
   * @param key An entry to delete
   */
  async del(key: string) {
    await this.cache.del(key);
  }

  /**
     *
     * @param attachment
     * @param isEditable
     * @returns
     */
  async getDocKey(attachment: string, isEditable: boolean = false): Promise<string> {
    let docKey = await this.get(
      `${this.constants.PREFIX_DOC_KEY_CACHE + attachment}`,
    );
    if (!docKey) {
      docKey = new Date().getTime().toString();
      if (isEditable) this.set(`${this.constants.PREFIX_DOC_KEY_CACHE + attachment}`, docKey, 30);
    }
    return docKey;
  }

  /**
     *
     * @param attachment
     * @param value
     * @param ttl
     */
  async setDocKey(attachment: string, value: string, ttl: number) {
    await this.set(`${this.constants.PREFIX_DOC_KEY_CACHE + attachment}`, value, ttl);
  }

  /**
     *
     * @param attachment
     */
  async docKeyCleanup(attachment: string) {
    await this.del(`${this.constants.PREFIX_DOC_KEY_CACHE + attachment}`);
  }
}
