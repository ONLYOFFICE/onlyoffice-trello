import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { TrelloProvider, TrelloStore } from "Root/context";

import { File, FileContainer } from "Components/card-button/file/File";
import { Header } from "Components/card-button/header/Header";
import { Info } from "Components/card-button/info/Info";

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
            <Route exact path="/card-button">
              <CardButton />
            </Route>
            <Route exact path="/show-settings">
              <Settings />
            </Route>
            <Route>
              <div style={{ margin: "1rem 3rem 0 3rem" }}>
                <Header />
                <Info />
                <FileContainer>
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                  <File />
                </FileContainer>
              </div>
            </Route>
          </Switch>
        </Router>
      </Suspense>
    </TrelloProvider>
  );
}

export default TrelloRouter;
