import "./App.css";

import { Redirect, Route, Switch } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import { NAV_ITEMS } from "./constants/navigation.js";
import NavBar from "./components/NavBar";
import React from "react";
import WordGame from "./pages/WordGame";

function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path={NAV_ITEMS.ABOUT_US.to} component={AboutUs} />
        <Route exact path={NAV_ITEMS.WORD_GAME.to} component={WordGame} />
        <Route render={() => <Redirect to={NAV_ITEMS.WORD_GAME.to} />} />
      </Switch>
    </>
  );
}

export default App;
