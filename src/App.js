import "./App.css";

import { Redirect, Route, Switch } from "react-router-dom";

import { NAV_ITEMS } from "./constants/navigation.js";
import React from "react";
import TrashClassifer from "./pages/TrashClassifer.js";

function App() {
  return (
    <>
      <Switch>
        <Route exact path={NAV_ITEMS.TRASH_CLASSIFIER.to} component={TrashClassifer} />
        <Route render={() => <Redirect to={NAV_ITEMS.TRASH_CLASSIFIER.to} />} />
      </Switch>
    </>
  );
}

export default App;
