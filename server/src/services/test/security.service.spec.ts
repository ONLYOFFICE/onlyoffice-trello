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

/* eslint-disable */
import { SecurityService } from '../security.service';

describe('Security Service', () => {
  let securityService: SecurityService;
  const text = 'hello';
  const key = '10'.repeat(16);

  beforeEach(async () => {
    securityService = new SecurityService();
  });

  it('aes encryption', () => {
    const encrypted = securityService.encrypt(text, key);
    expect(encrypted).not.toBeNull();
  });

  it('aes decryption', () => {
    const encrypted = securityService.encrypt(text, key);
    const decrypted = securityService.decrypt(encrypted, key);

    expect(text).toEqual(decrypted);
  });

  it('aes invalid key', () => {
    const invKey = 'invalid';
    const t = () => {
      securityService.encrypt(text, invKey);
    };
    expect(t).toThrow();
  });

  it('jwt signature', () => {
    const sig = securityService.sign({ test: 'ok' }, key);
    expect(sig).not.toBeNull();
  });

  it('jwt signature verification', () => {
    const sig = securityService.sign({ test: 'ok' }, key);
    securityService.verify(sig, key);
  });
});
