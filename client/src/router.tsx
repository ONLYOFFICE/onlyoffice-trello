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

import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'root/i18n/index';

const EnableInfo = React.lazy(() => import('components/on-enable/EnableInfo'));
const CardButton = React.lazy(
  () => import('components/card-button/CardButton'),
);
const Settings = React.lazy(() => import('components/settings/Settings'));

function TrelloRouter(): JSX.Element {
  return (
      <Suspense fallback={<div style={{margin: '6px'}}/>}>
          <Router basename='/'>
              <Routes>
                  <Route
                      path='/card-button'
                      element={<CardButton/>}
                  />
                  <Route
                      path='/show-settings'
                      element={<Settings/>}
                  />
                  <Route
                      path='/on-enable'
                      element={<EnableInfo/>}
                  />
              </Routes>
          </Router>
      </Suspense>
  );
}

export default TrelloRouter;
