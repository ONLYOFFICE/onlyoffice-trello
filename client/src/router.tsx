import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { TrelloProvider, TrelloStore } from "Root/context";

const CardButton = React.lazy(
  () => import("./components/card-button/CardButton")
);
const Settings = React.lazy(() => import("./components/settings/Settings"));

const store = new TrelloStore();

function TrelloRouter() {
  return (
    <TrelloProvider store={store}>
      <Suspense fallback={<div style={{ margin: "6px" }}>Loading..</div>}>
        <Router basename="/">
          <Switch>
            <Route exact path="/card-button.html">
              <CardButton />
            </Route>
            <Route exact path="/show-settings.html">
              <Settings />
            </Route>
            <Route>Home</Route>
          </Switch>
        </Router>
      </Suspense>
    </TrelloProvider>
  );
}

export default TrelloRouter;
