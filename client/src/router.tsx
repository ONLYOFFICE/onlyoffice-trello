import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const CardButton = React.lazy(
  () => import('components/card-button/CardButton'),
);
const Settings = React.lazy(() => import('components/settings/Settings'));

function TrelloRouter(): JSX.Element {
  return (
      <Suspense fallback={<div style={{margin: '6px'}}/>}>
          <Router basename='/'>
              <Switch>
                  <Route
                      exact={true}
                      path='/card-button'
                  >
                      <CardButton/>
                  </Route>
                  <Route
                      exact={true}
                      path='/show-settings'
                  >
                      <Settings/>
                  </Route>
              </Switch>
          </Router>
      </Suspense>
  );
}

export default TrelloRouter;
