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

import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Error} from 'components/card-button/error/Error';

import {trello} from 'root/api/client';

export default function EnableInfo(): JSX.Element {
  const {i18n} = useTranslation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // TODO: Extract as a hook
    const handler = async (): Promise<void> => {
      await i18n.changeLanguage(window.locale);
      setLoading(false);
    };
    // eslint-disable-next-line
    handler().then(() => trello.render((): void => {}));
  }, [i18n]);

  if (loading) {
    return (
        <div/>
    );
  }

  return (
      <Error
          header='onlyoffice.enable.info.header'
          body='onlyoffice.enable.info.body'
      />
  );
}
