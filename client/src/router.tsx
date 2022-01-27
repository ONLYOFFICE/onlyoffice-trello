import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

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
              </Routes>
          </Router>
      </Suspense>
  );
}

export default TrelloRouter;
