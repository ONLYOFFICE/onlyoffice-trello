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
import { Constants } from '@utils/const';
import { FileUtils } from '@utils/file';
import { OAuthUtil } from '@utils/oauth';
import { ValidatorUtils } from '../validation';

describe('Validator Utils', () => {
  let validator: ValidatorUtils;

  beforeEach(async () => {
    validator = new ValidatorUtils(new FileUtils(new Constants()), new OAuthUtil());
  });

  it('https valid url', () => {
    const valid = validator.validURL('https://httpbin.com/');
    expect(valid).toBe(true);
  });

  it('https invalid url', () => {
    const valid = validator.validURL('https://httpbin.com');
    expect(valid).toBe(false);
  });

  it('any http is invalid', () => {
    const valid = validator.validURL('http://httpbin.com');
    expect(valid).toBe(false);
  });
});
